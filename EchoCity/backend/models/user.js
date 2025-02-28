"use strict";

import db from '../db.js';
import bcrypt from 'bcrypt';
import { BCRYPT_WORK_FACTOR } from '../config.js';
import sqlForPartialUpdate from '../helpers/sql.js';

// this makes sure we are not passing sensitive info i.e. password
const userProps = [
    `id`,
    `username`,
    `email`,
    `first_name AS "firstName"`,
    `last_name AS "lastName"`,
    `city`,
    `state`
];

const userPropsSql = userProps.join(", ");

class User {
    // User.signup - allows a user to create an account
    // Returns { id, username, firstName, lastName, email, state, city }
    // email is used for logging in
    static async signup({ username, password, email, firstName, lastName, city, state }){
        const duplicateUsernameCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        );

        const duplicateEmailCheck = await db.query(
            `SELECT email
            FROM users
            WHERE email = $1`,
            [email]
        );

        if(duplicateUsernameCheck.rows[0]){
            throw new Error(`Duplicate username: ${username}`)
        };
        if(duplicateEmailCheck.rows[0]){
            throw new Error(`Duplicate email: ${email}`)
        };

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (username, password, email, first_name, last_name, city, state)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING ${userPropsSql}`,
            [
                username,
                hashedPassword,
                email,
                firstName,
                lastName,
                city,
                state
            ],
        );

        const user = result.rows[0];
        return user;
    }
    // User.authenticate - authenticates a user with their email/password
    // to login, user needs to use their email
    static async authenticate({ email, password }){
        // find the user first
        const result = await db.query(
            `SELECT 
                id, 
                username, 
                email, 
                password, 
                first_name AS "firstName",
                last_name AS "lastName", 
                city, 
                state 
            FROM users
            WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];

        if(user){
            // compare hashed pwd to a new hash from pwd
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid){
                delete user.password;
                return user;
            }
        }

        throw new Error(`Invalid email/password`)
    }

    // Finds a user based on their username
    static async getUserById(id){

        const userRes = await db.query(
            `SELECT 
                id,
                username, 
                email, 
                first_name AS "firstName", 
                last_name AS "lastName", 
                city, 
                state,
                created_at AS "createdAt"
            FROM users
            WHERE id = $1`,
            [id]
        );

        const user = userRes.rows[0];

        if(!user) throw new Error(`No user with id: ${id}`);

        return user;
    }

    static async editUser(id, data){
        if(data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        };

        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: "first_name",
            lastName: "last_name",
            createdAt: "created_at",
        });

        const querySql = `UPDATE users
                          SET ${setCols}
                          WHERE id = $${values.length + 1}
                          RETURNING ${userPropsSql}`;

        const result = await db.query(querySql, [...values, id]);
        const user = result.rows[0];

        if(!user) throw new Error("No user found.");

        return user;
    }
}

export default User;