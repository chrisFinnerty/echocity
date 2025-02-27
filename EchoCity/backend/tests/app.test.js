import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../app.js';
import db from '../db.js';
import { response } from 'express';

const request = supertest.default || supertest;

beforeAll(async () => {
    await db.query(`
        INSERT INTO users (username, email, password, first_name, last_name, city, state)
        VALUES ('testAgain1', 'tester1234@email.com', 'test123', 'tester', 'testing', 'Los Angeles', 'CA')`
    );
})

afterAll( async () => {
    await db.query(` DELETE FROM users WHERE username = 'testAgain' `);
    await db.query(` DELETE FROM users WHERE username = 'testAgain1' `);
    await db.end();
})

describe("POST /auth/signup", () => {
    it('should return 201 and token', async() => {
        const signupUser = await request(app).post("/auth/signup").send({
            username: "testAgain",
            email: "tester@email.com",
            password: "test123",
            firstName: "first",
            lastName: "last",
            city: "Los Angeles",
            state: "CA"
        });

        const token = signupUser.body.data.token;

        expect(signupUser.status).toBe(201);
        expect(token).toBeDefined();
    })
})

describe("GET /auth/login", () => {
    it('should return 200 and JSON', async() => {
        const loginUser = await request(app).post(`/auth/login`).send({
            email: "tester@email.com",
            password: "test123"
        });

        expect(loginUser.status).toBe(200);
    });
});

