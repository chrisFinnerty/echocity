"use strict";

import express from 'express';
import jsonschema from 'jsonschema';
import createToken from '../helpers/tokens.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

import User from '../models/user.js';

// Schemas
import userSignupSchema from '../schemas/userSignup.json' with {type: "json"};
import userAuthSchema from '../schemas/userAuth.json' with {type: "json"};

const router = express.Router();

// POST /auth/register: { user } => { token }
// user must incliude { username, email, password, first_name, last_name, city, state }
// Returns JWT token which can be used to auth further requests
// Auth required: none

router.post('/signup', async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userSignupSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new Error(errs);
        };

        const newUser = await User.signup(req.body);
        const token = createToken(newUser);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000, // cookie expires in 10 days
        });

        return res.status(201).json({ data: { user: newUser, token } });
    } catch(err){
        console.error("Error registering:", err);

        if(err.message.includes("Duplicate username")){
            return res.status(409).json({ error: `Username "${req.body.username}" already exists!` });
        };

        if(err.message.includes("Duplicate email")){
            return res.status(409).json({ error: `Email "${req.body.email}" already exists!` })
        };

        if(err.message.includes("Passwords must be at least 8 characters long.")){
            return res.status(403).json({ error: "Passwords must be at least 8 characters long." })
        };

        return next();
    }
});

// POST /auth/token: { email, password } => { token }
// Returns JWT token which can be used to auth further requests.
// Auth required: none

router.post('/login', async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new Error(errs);
        };

        const user = await User.authenticate(req.body);
        const token = createToken(user);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000, // cookie expires in 10 days
        });

        return res.json({ data: { user, token } });
    } catch(err){
        console.error(err);
        return res.status(401).json({ error: `Invalid username/password` });
    }
})

router.post('/authenticate', async function(req, res, next){
    try{
        const jwtCookie = req.cookies?.jwt;
        if(!jwtCookie){
            return res.status(200).json( {data: {user: null, token: null} });
        };

        const parsedJwt = jwt.verify(jwtCookie, SECRET_KEY);
        const user = await User.getUserById(parsedJwt.id);

        res.cookie('jwt', jwtCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'None' : 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000, // cookie expires in 10 days
        });

        return res.json({ data: { user, token: jwtCookie } })
    } catch(err){
        console.error("API error - authenticate", err);
    };
});

router.post("/logout", async function (req, res, next) {
    try {
      // when user logs out, delete cookie
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
      });
  
      return res.status(204).send();
    } catch (err) {
      console.log('API Error - logout:', err);
      return res.status(204);
    }
  });

export default router;