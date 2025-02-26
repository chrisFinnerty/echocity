import fetch from 'node-fetch';
import pkg from 'pg';
import cron from 'node-cron';
import { config } from 'dotenv';

const { Pool } = pkg;
config();

// Environment Variables
const TM_API_KEY = process.env.TM_API_KEY;
const TM_API_BASE_URL = process.env.TM_API_BASE_URL;

const DB_CONFIG = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool(DB_CONFIG);
let isSyncing = false;

async function syncTicketmasterEvents(){
  if(isSyncing) return;
  isSyncing = true;
  
  try {
    console.log("STARTING API DATA SYNC");

    let currentPage = 0;
    let totalPages = 1;
    let totalEvents = 0;

    while(currentPage < totalPages && totalEvents !== 1000){
        // 1. Fetch events from Ticketmaster API
        const response = await fetch(
          `${TM_API_BASE_URL}/events.json?apikey=${TM_API_KEY}&classificationName=rock&countryCode=US&size=200&page=${currentPage}`
        );
        
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        
        const data = await response.json();
        const events = data?._embedded?.events || [];
        totalEvents += events.length;
    
        // 2. Process each event
        for (const event of events) {
          await processEvent(event);
        }
    
        if(currentPage === 0) {
            totalPages = data.page?.totalPages || 1;
        }
    
        currentPage++;
    }

    console.log(`Synced ${totalEvents} events successfully`);
    isSyncing = false;
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function processEvent(eventData){
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 3. Extract core event data
    const event = {
      id: eventData.id,
      name: eventData.name,
      url: eventData.url,
      date: eventData.dates?.start?.localDate,
      venue: eventData._embedded?.venues?.[0],
      artists: eventData._embedded?.attractions || [],
      imageUrl: eventData.images?.reduce((best, img) => {
        if(img.ratio === '16_9'){
            if(!best || img.width > best.width) return img
        }
        return best
      }, null)?.url || null
    };

    // 4. Upsert venue
    if(event.venue){
      await client.query(`
        INSERT INTO venues (id, name, address, city, state, country, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          address = EXCLUDED.address,
          updated_at = NOW()
      `, [
        event.venue.id,
        event.venue.name,
        event.venue.address?.line1,
        event.venue.city?.name,
        event.venue.state?.stateCode,
        event.venue.country?.countryCode,
        event.venue.location?.latitude,
        event.venue.location?.longitude
      ]);
    }

    // 5. Insert main event before processing artists
    await client.query(`
        INSERT INTO events (id, name, date, venue_id, url, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            date = EXCLUDED.date,
            venue_id = EXCLUDED.venue_id,
            image_url = EXCLUDED.image_url,
            updated_at = NOW()
        `, [
        event.id,
        event.name,
        event.date,
        event.venue?.id,
        event.url,
        event.imageUrl
        ]);

    // 6. Upsert artists and link to event
    for (const artist of event.artists){
      // Insert artist
      await client.query(`
        INSERT INTO artists (id, name, genre, subgenre, url, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          genre = EXCLUDED.genre,
          subgenre = EXCLUDED.subgenre,
          image_url = EXCLUDED.image_url,
          updated_at = NOW()
      `, [
        artist.id,
        artist.name,
        artist.classifications?.map(c => c.genre?.name || null) || [],
        artist.classifications?.map(c => c.subGenre?.name || null) || [],
        artist.url,
        artist.images?.reduce((best, img) => {
          if(img.ratio === '16_9'){
              if(!best || img.width > best.width) return img
          }
          return best
        }, null)?.url || null
      ]);

      // Link artist to event
      await client.query(`
        INSERT INTO event_artists (event_id, artist_id)
        VALUES ($1, $2)
        ON CONFLICT (event_id, artist_id) DO NOTHING
      `, [event.id, artist.id]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Run sync every 6 hours
cron.schedule('0 */6 * * *', () => {
    syncTicketmasterEvents();
    console.log('Sync job triggered every 6 hours');
  });
syncTicketmasterEvents(); // Initial run