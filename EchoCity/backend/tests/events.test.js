import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../app.js';
import db from '../db.js';

const request = supertest.default || supertest;

beforeAll(async () => {
    await db.query(`
        INSERT INTO venues
        (id, name, address, city, state, country, latitude, longitude)
        VALUES (10, 'testVenue', '100 Main St', 'Los Angeles', 'CA', 'US', 100, 100)
        ON CONFLICT (id) DO NOTHING;
        `);

    await db.query(`
        INSERT INTO artists (id, name, url, image_url) 
        VALUES ('artist1', 'Test Artist', 'https://test.com', 'https://test.com/image.jpg')
    `);

    await db.query(`
        INSERT INTO events
        (id, name, date, venue_id, url, image_url)
        VALUES ('abcd1', 'testEvent', '2025-03-01', 10, 'https://www.google.com', 'https://www.google.com')
        ON CONFLICT (id) DO NOTHING;
        `);
    await db.query(`
        INSERT INTO events
        (id, name, date, venue_id, url, image_url)
        VALUES ('abcd2', 'testEvent2', '2025-03-02', 10, 'https://www.google.com', 'https://www.google.com')
        ON CONFLICT (id) DO NOTHING;
        `);
        console.log(await db.query(`
            SELECT * FROM events WHERE id = 'abcd2';
            `))
        
});

afterAll( async () => {
    await db.query(` DELETE FROM events WHERE id IN ('abcd1', 'abcd2') `);
    await db.query(` DELETE FROM artists WHERE id='artist1' `);
    await db.end();
})

describe("GET /api/events", () => {
    it('should return 200 and data in JSON', async() => {
        const response = await request(app).get(`/api/events`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
})
describe("GET /api/events/:id", () => {
    it('should return 200 and data in JSON', async() => {
        const response = await request(app).get(`/api/events/abcd2`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
})

