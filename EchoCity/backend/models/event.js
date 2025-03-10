"use strict";
import db from '../db.js';

// GET Events from Database
class Event {

    static async getEvents(filters){
          const { city, state, genre, subgenre, searchTerm } = filters;
          
          const query = `
            SELECT 
              e.id as "eventId",
              e.name as "eventName",
              e.date as "eventDate",
              e.url,
              e.image_url as "imageUrl",
              v.id as "venueId",
              v.name as "venueName",
              v.city,
              v.state,
              v.latitude,
              v.longitude,
              json_agg(json_build_object(
                'artistId', a.id,
                'artistName', a.name,
                'genre', a.genre,
                'subgenre', a.subgenre
              )) as artists
            FROM events e
            JOIN venues v ON e.venue_id = v.id
            JOIN event_artists ea ON e.id = ea.event_id
            JOIN artists a ON ea.artist_id = a.id
            WHERE
              e.date >= CURRENT_DATE AND
              ($1::text IS NULL OR v.city ILIKE $1) AND
              ($2::text IS NULL OR v.state ILIKE $2) AND
              ($3::text IS NULL OR $3 ILIKE ANY(a.genre)) AND
              ($4::text IS NULL OR $4 ILIKE ANY(a.subgenre)) AND
              ($5::text IS NULL OR 
                e.name ILIKE CONCAT('%', $5, '%') OR
                v.name ILIKE CONCAT('%', $5, '%') OR
                v.city ILIKE CONCAT('%', $5, '%') OR
                v.state ILIKE CONCAT('%', $5, '%') OR
                a.name ILIKE CONCAT('%', $5, '%'))
            GROUP BY e.id, v.id
            ORDER BY e.date
          `;
      
          const result = await db.query(query, [city, state, genre, subgenre, searchTerm]);
          const events = result.rows;

          return events;
    };

    //   GET Single Event from Database
  static async getEventDetails(id) {

    const eventQuery = `
      SELECT 
        e.id as "eventId",
        e.name as "eventName",
        e.date as "eventDate",
        e.url,
        e.image_url as "imageUrl",
        json_build_object(
          'id', v.id,
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
            'artistId', a.id,
            'artistName', a.name,
            'url', a.url,
            'imageUrl', a.image_url
          )
        ) as artists
      FROM events e
      JOIN venues v ON e.venue_id = v.id
      JOIN event_artists ea ON e.id = ea.event_id
      JOIN artists a ON ea.artist_id = a.id
      WHERE e.id = $1
      GROUP BY e.id, v.id
    `;

    const result = await db.query(eventQuery, [ id ]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];

};

    static async getEventsByArtistId(id){

            const query = `
              SELECT 
                e.id as "eventId",
                e.name as "eventName",
                e.date as "eventDate",
                e.url,
                e.image_url as "imageUrl",
                v.id as "venueId",
                v.name as "venueName",
                v.city,
                v.state,
                v.latitude,
                v.longitude,
                json_agg(json_build_object(
                  'artistId', a.id,
                  'artistName', a.name,
                  'genre', a.genre,
                  'subgenre', a.subgenre
                )) as artists
              FROM events e
              JOIN venues v ON e.venue_id = v.id
              JOIN event_artists ea ON e.id = ea.event_id
              JOIN artists a ON ea.artist_id = a.id
              WHERE
                e.date >= CURRENT_DATE AND
                a.id = $1
              GROUP BY e.id, v.id
              ORDER BY e.date
              LIMIT 100
            `;
        
            const result = await db.query(query, [ id ]);
            const events = result.rows;
  
            return events;
    };
};
  

  
  export default Event;