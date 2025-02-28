import express from 'express';
import jsonschema from 'jsonschema';
import { ensureCorrectUser, ensureLoggedIn } from '../middleware/auth.js';
import userUpdateScema from '../schemas/userUpdate.json' with {type: "json"};
import User from '../models/user.js';

const router = express.Router();

// GET /[username] => { user }

// Returns { username, email, first_name, last_name, city, state } 
// Route used for a signed in user to access their profile + user details
router.get('/:id', async function(req, res, next){
    try{
        const user = await User.getUserById(req.params.id);
        if(!user) return res.status(404).json({ message: "User not found." });

        return res.json({ data: user });
    } catch(err){
        console.error(err);
        next(err);
    }
});

// PATCH /[username] => { updateUser }
router.patch('/:id', ensureLoggedIn, ensureCorrectUser, async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userUpdateScema);
        if(!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new Error(errs);
        };

        const user = await User.editUser(req.params.id, req.body);

        return res.json({ data: user })
    } catch(err){
        console.error(err);
        next(err);
    }
})

export default router;