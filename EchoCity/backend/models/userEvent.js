import db from "../db.js";

class UserEvent {
    static async createUserEvent(userId, eventId, isInterested, isAttended){
        const result = await db.query(
            `INSERT INTO user_events
             (user_id, event_id, is_interested, is_attended)
             VALUES ($1, $2, $3, $4)
             RETURNING user_id AS "userId", event_id AS "eventId", is_interested AS "isInterested", is_attended AS "isAttended"
            `, [ userId, eventId, isInterested, isAttended ]);

        const userEvent = result.rows[0]
        return userEvent;
    }

    static async updateUserEvent(userId, eventId, isInterested, isAttended){
        console.log("BEFORE QUERY TO DB - isInterested", isInterested);
        console.log("BEFORE QUERY TO DB - isAttended", isAttended);

        const result = await db.query(
            `UPDATE user_events
             SET is_interested = $1, is_attended = $2
             WHERE user_id = $3 AND event_id = $4
             RETURNING user_id AS "userId", event_id AS "eventId", is_interested AS "isInterested", is_attended AS "isAttended"
            `, [ isInterested, isAttended, userId, eventId ]
        );

        const updatedEvent = result.rows[0];
        console.log("AFTER QUERY TO DB - isInterested", updatedEvent.isInterested);
        console.log("AFTER QUERY TO DB - isAttended", updatedEvent.isAttended);
        return updatedEvent;
    }

    static async getAllUserEvents(userId){
        const result = await db.query(
            `SELECT 
             ue.is_interested AS "isInterested",
             ue.is_attended AS "isAttended",
             ue.marked_attended_date AS "markedAttendedDate",
             e.id AS "eventId",
             e.name AS "eventName",
             e.date AS "eventDate",
             e.image_url as "imageUrl",
             e.url,
            json_agg(
                json_build_object(
                    'artistId', a.id,
                    'artistName', a.name,
                    'url', a.url,
                    'imageUrl', a.image_url
                )
            ) as artists,
            json_build_object(
                'id', v.id,
                'name', v.name,
                'address', json_build_object('line1', v.address),
                'city', json_build_object('name', v.city),
                'state', json_build_object('stateCode', v.state)
            ) as venue
             FROM user_events ue
             JOIN events e ON ue.event_id = e.id
             JOIN venues v ON e.venue_id = v.id
             JOIN event_artists ea ON ue.event_id = ea.event_id
             JOIN artists a ON ea.artist_id = a.id
             WHERE user_id = $1
             GROUP BY 
                ue.is_interested, ue.is_attended, ue.marked_attended_date,
                e.id, e.name, e.date, e.url,
                v.id, v.name, v.address, v.city, v.state
            ORDER BY e.date
             `, [ userId ]
        );

        const userEvents = result.rows;
        return userEvents;
    }
    static async getUserEvent(userId, eventId){
        const result = await db.query(
            `SELECT 
             ue.is_interested AS "isInterested",
             ue.is_attended AS "isAttended",
             ue.marked_attended_date AS "markedAttendedDate",
             e.id AS "eventId",
             e.name AS "eventName",
             e.date AS "eventDate",
             e.image_url as "imageUrl",
             e.url,
            json_agg(
                json_build_object(
                    'artistId', a.id,
                    'artistName', a.name,
                    'url', a.url,
                    'imageUrl', a.image_url
                )
            ) as artists,
            json_build_object(
                'id', v.id,
                'name', v.name,
                'address', json_build_object('line1', v.address),
                'city', json_build_object('name', v.city),
                'state', json_build_object('stateCode', v.state)
            ) as venue
             FROM user_events ue
             JOIN events e ON ue.event_id = e.id
             JOIN venues v ON e.venue_id = v.id
             JOIN event_artists ea ON ue.event_id = ea.event_id
             JOIN artists a ON ea.artist_id = a.id
             WHERE user_id = $1 AND e.id = $2
             GROUP BY 
                ue.is_interested, ue.is_attended, ue.marked_attended_date,
                e.id, e.name, e.date, e.url,
                v.id, v.name, v.address, v.city, v.state
            ORDER BY e.date
             `, [ userId, eventId ]
        );

        const userEvent = result.rows[0];
        return userEvent;
    }
}

export default UserEvent;