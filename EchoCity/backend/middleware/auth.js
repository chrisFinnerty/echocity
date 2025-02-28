"use strict";

import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';


// Middleware: Authenticate user

// If token was provided, verify it, and if valid, store the token payload
// on res.locals

// It's not an error if no token was provided or if the token is not valid.

function authenticateJWT(req, res, next) {
    try{
        const authHeader = req.headers && req.headers.authorization
        if(authHeader){
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch(err){
        return next();
    }
};

// Middleware: ensure user is logged in. If not, raise an error.

function ensureLoggedIn(req, res, next) {
    try{   
        if(!res.locals.user) throw new Error("Access Denied.")
        return next();
    } catch(err){
        console.error(err);
    }
};

function ensureCorrectEmail(req, res, next){
    try{
        const user = res.locals.user;
        if(!(user && user.email === req.params.email)) {
            throw new Error("Access Denied.")
        }
        return next();
    } catch(err){
        console.error(err);
    }
};

function ensureCorrectUser(req, res, next){
    try{
        const user = res.locals.user;
        const userId = res.locals.user.id.toString();
        if(!(user && userId === req.params.id)) {
            throw new Error("Access Denied.")
        }
        return next();
    } catch(err){
        console.error(err);
    }
};

export {
    authenticateJWT,
    ensureCorrectEmail,
    ensureCorrectUser,
    ensureLoggedIn
};