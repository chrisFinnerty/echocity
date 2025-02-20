import express from 'express';
const router = express.Router();
import Favorite from '../models/favorite.js';

// POST - add a favorite artist for favorite_artists
router.post('/artists', async function(req, res, next){
    try{
        const { userId, artistId } = req.body;
        console.log(userId, artistId);
        const favoriteArtist = await Favorite.addFavoriteArtist(userId, artistId);
        return res.json({ data: favoriteArtist })
    } catch(err){
        console.error("Database error", err);
        res.status(500).json({error: "Failed to post favorite artists."});
    }
});

// GET - select a single artist from favorite_artists
router.get('/artists/:id', async function(req, res, next){
    try{
        const { userId, artistId } = req.query;
        const favoriteArtist = await Favorite.getFavoriteArtist(userId, artistId);
        return res.json({ data: favoriteArtist });
    } catch(err){
        console.error("Database error", err);
        res.status(500).json({ error: "Failed to fetch favorite artist." })
    }
});

// GET - get ALL artists from favorite_artists based upon a user_id
router.get('/:userId/artists', async function(req, res, next){
    try{
        const { userId } = req.params;
        console.log(userId);
        const favoriteArtists = await Favorite.getAllFavoriteArtists(userId);
        console.log(favoriteArtists);
        return res.json({ data: favoriteArtists });
    } catch(err){
        console.error("Database error", err);
        res.status(500).json({ error: "Failed to fetch all favorite artists." })
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