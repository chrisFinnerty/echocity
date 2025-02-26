"use strict";

import db from "../db.js";


class Artist {
    static async getById(id){

        const result = await db.query(
            `SELECT 
                id,
                name,
                genre,
                subgenre,
                url,
                image_url AS "imageUrl"
             FROM artists
             WHERE id = $1
            `, [ id ]
        );

        const artist = result.rows[0];
        return artist;
    }

    static async getMultipleByIds(artistIdArr){
        if (!artistIdArr) return [];

        const placeholders = artistIdArr.map((_, idx) => `$${idx + 1}`).join(', ');

        const result = await db.query(
            `SELECT 
                id,
                name,
                genre,
                subgenre,
                url,
                image_url AS "imageUrl"
             FROM artists
             WHERE id IN (${placeholders})
            `, [ artistIdArr ]
        );

        const artists = result.rows[0];
        return artists;
    }
}

export default Artist;