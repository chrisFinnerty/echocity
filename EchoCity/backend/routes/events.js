import express from 'express';
import Event from '../models/event.js';
const router = express.Router();

// const {Pool} = pkg;
// config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// });

// GET Events from Database
router.get('/', async (req, res) => {
    try {
      const { city, genre, subgenre } = req.query;

      const events = await Event.getEvents({ city, genre, subgenre });
    
      return res.json({ data: events });
      
    } catch (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });
  
  // GET Single Event from Database
  router.get('/:id', async (req, res) => {
    try {
      const eventQuery = `
        SELECT 
          e.*,
          json_build_object(
            'id', v.venue_id,
            'name', v.name,
            'address', json_build_object('line1', v.address),
            'city', json_build_object('name', v.city),
            'state', json_build_object('stateCode', v.state),
            'location', json_build_object(
              'latitude', v.latitude,
              'longitude', v.longitude
            )
          ) as venue,
          json_agg(
            json_build_object(
              'id', a.artist_id,
              'name', a.name,
              'url', a.url
            )
          ) as artists
        FROM events e
        JOIN venues v ON e.venue_id = v.venue_id
        JOIN event_artists ea ON e.event_id = ea.event_id
        JOIN artists a ON ea.artist_id = a.artist_id
        WHERE e.event_id = $1
        GROUP BY e.event_id, v.venue_id
      `;
  
      // const { rows } = await db.query(eventQuery, [req.params.id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      const event = rows[0];
      const transformed = {
        id: event.event_id,
        name: event.name,
        url: event.url,
        dates: {
          start: {
            dateTime: event.event_date.toISOString()
          }
        },
        _embedded: {
          venues: [event.venue],
          attractions: event.artists
        }
      };
  
      res.json(transformed);
      
    } catch (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  });
  
  export default router;