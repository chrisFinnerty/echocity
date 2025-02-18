import express from 'express';
import Artist from '../models/artist.js';
import Event from '../models/event.js';
const router = express.Router();


// GET artist
router.get('/:id', async function(req, res, next) {
    try{
        const artist = await Artist.getById(req.params.id);
        if(!artist) return res.status(404).json({message: "Artist not found"});

        return res.json({ data: artist });
    } catch(err){
        console.error("Error fetching artist", err);
        return next();
    }

});
// GET an artist's events 
router.get('/:id/events', async function(req, res, next) {
    try{
        const artistEvents = await Event.getEventsByArtistId(req.params.id);

        return res.json({ data: artistEvents });
    } catch(err){
        console.error("Error fetching artist events", err);
        return next();
    }
})

export default router;