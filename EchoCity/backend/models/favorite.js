"use strict";
import db from "../db.js";

class Favorite{
    // adds a favorite artist to the favorite_artists datatable
    static async addFavoriteArtist(userId, artistId){

        const result = await db.query(
            `
            INSERT INTO favorite_artists (user_id, artist_id)
            VALUES($1, $2)
            RETURNING *
        `, [userId, artistId]
        );

        const favoriteArtist = result.rows[0];

        return favoriteArtist;
    };

    static async getFavoriteArtist(userId, artistId){

        const result = await db.query(
            `SELECT 
                user_id AS "userId",
                artist_id AS "artistId"
             FROM favorite_artists
             WHERE user_id = $1 AND artist_id = $2
            `, [ userId, artistId ]
        );

        const favoriteArtist = result.rows[0];
        return favoriteArtist;
    }

    static async deleteFavoriteArtist(userId, artistId){
        const result = await db.query(
            `DELETE FROM favorite_artists
             WHERE user_id = $1 AND artist_id = $2
             RETURNING user_id AS "userId", artist_id AS "artistId"
             `, [ userId, artistId ]
        );

        const deletedArtist = result.rows[0];
        return deletedArtist;
    }
}

export default Favorite;