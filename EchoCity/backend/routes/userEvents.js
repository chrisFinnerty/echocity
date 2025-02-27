import express from 'express';
import jsonschema from 'jsonschema';
import userEventsCreateSchema from '../schemas/userEventsCreate.json' assert {type: 'json'};
import userEventsUpdateSchema from '../schemas/userEventsUpdate.json' assert {type: 'json'};
import UserEvent from '../models/userEvent.js';
const router = express.Router();

// POST - create a User Event and mark it either "Interested" or "Attended"
router.post('/', async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, userEventsCreateSchema);
        if(!validator.valid){
            const errs = validator.errors.map((e => e.stack));
            throw new Error(errs);
        };

        const { userId, eventId, isInterested, isAttended } = req.body;
        console.log(userId, eventId, isInterested, isAttended);
        const userEvent = await UserEvent.createUserEvent(userId, eventId, isInterested, isAttended);

        return res.json({ data: userEvent });
    }catch(err){
        console.error(err);
    }
});

// PATCH - update a user's event as either "Interested" or "Attended"
router.patch('/:userId/:eventId', async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, userEventsUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map((e => e.stack));
            throw new Error(errs);
        };

        const { userId, eventId } = req.params;
        const { isInterested, isAttended } = req.body;
        console.log("BEFORE API CALL - isInterested:", isInterested);
        console.log("BEFORE API CALL - isAttended:", isAttended);

        const updatedUserEvent = await UserEvent.updateUserEvent(userId, eventId, isInterested, isAttended);

        console.log("AFTER API CALL - isInterested:", updatedUserEvent.isInterested);
        console.log("BEFORE API CALL - isAttended:", updatedUserEvent.isAttended);
        return res.json({data: updatedUserEvent});
    } catch(err){
        console.error("Error updating user's event", err);
    }
});

// GET - get all User Events with a userId
router.get('/:userId', async function(req, res, next){
    const { userId } = req.params;
    const userEvents = await UserEvent.getAllUserEvents(userId);

    return res.json({ data: userEvents });
});

// GET - get a single User Event with a userId and eventId
router.get('/:userId/:eventId', async function(req, res, next){
    try{
        const { userId, eventId } = req.params;
        console.log(eventId);
        const userEvent = await UserEvent.getUserEvent(userId, eventId);
        return res.json({ data: userEvent });
    } catch(err){
        console.error("Error getting user event", err);
    }
})

export default router;