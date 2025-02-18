import express from 'express';
const router = express.Router();
import Favorite from '../models/favorite.js';

// POST - add a favorite artist for favorite_artists
router.post('/artists', async function(req, res, next){
    try{
        const { userId, artistId } = req.body;
        const favoriteArtist = await Favorite.addFavoriteArtist(userId, artistId);
        return res.json({ data: favoriteArtist })
    } catch(err){
        console.error("Database error", err);
        res.status(500).json({error: "Failed to post favorite artists."});
    }
});

// GET - select a single artist from favorite_artists
router.get('/artists', async function(req, res, next){
    try{
        const { userId, artistId } = req.query;
        const favoriteArtist = await Favorite.getFavoriteArtist(userId, artistId);
        return res.json({ data: favoriteArtist });
    } catch(err){
        console.error("Database error", err);
        res.status(500).json({ error: "Failed to fetch favorite artist." })
    }
});

// DELETE - delete a single artist from favorite_artists
router.delete('/artists', async function(req, res, next){
    try{
        const { userId, artistId } = req.body;
        const deletedFavoriteArtist = await Favorite.deleteFavoriteArtist(userId, artistId);

        return res.json({ data: deletedFavoriteArtist });
    } catch(err){
        console.error("Database error", err);
        res.status(500).json({ error: "Failed to delete favorited artist."});
    }
})

export default router;