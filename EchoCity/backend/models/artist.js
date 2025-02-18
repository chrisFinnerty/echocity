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
}

export default Artist;