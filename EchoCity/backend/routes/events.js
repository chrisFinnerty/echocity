import express from 'express';
import Event from '../models/event.js';
const router = express.Router();

// GET Events from Database
router.get('/', async (req, res) => {
    try {
      const { city, state, genre, subgenre, searchTerm } = req.query;

      const events = await Event.getEvents({ city, state, genre, subgenre, searchTerm });
    
      return res.json({ data: events });
      
    } catch (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });
  
  // GET Single Event from Database
  router.get('/:id', async (req, res) => {
    try {
      console.log("GET EVENT req.params.id:", req.params.id)
      const eventDetails = await Event.getEventDetails(req.params.id);

      return res.json({ data: eventDetails })

    } catch (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  });
  
  export default router;