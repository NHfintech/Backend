const express = require('express');
const router = express.Router();
const {Event} = require('../models');
const {User} = require('../models');
const {EventAdmin} = require('../models');
const util = require('../utils');
const code = util.code;

const responseJson = {};

// post1 : check phonenubmer
router.post('/', async function(req, res, next) {
    console.log(util.getUser(req, res));
    const eventAdmin = req.body.eventAdmin;
    console.log(eventAdmin);
    const admin = [];

    for(let i = 0; i < eventAdmin.length; i++) {
        if(util.phoneNumberCheck(eventAdmin[i])) {
            const adminResult = await User.findOne(
                {where: {phone_number: eventAdmin[i]}},
            );

            if(adminResult == null) {
                admin.push({id: null, user_phone: eventAdmin[i]});
            } else {
                admin.push({id: adminResult.id, user_phone: eventAdmin[i]});
            }
        } else {
            responseJson.result = code.PHONE_NUMBER_INVALID;
            responseJson.detail = 'phone number invalid';
            res.json(responseJson);
            return;
        }
    }
    req.body.admins = admin;
    next();
});

// post2 : event insert
router.post('/', async function(req, res, next) {
    const body = req.body;
    try {
        const result = await Event.create(
            {
                // TODO: user id input 변경하기
                user_id: 1,
                category: body.category,
                title: body.title,
                location: body.location,
                body: body.body,
                start_datetime: body.startDatetime,
                end_datetime: body.endDatetime,
                is_activate: true,
            },
        );
        console.dir(result);
        const eventId = result.dataValues.id;
        for(let i = 0; i < req.body.admins.length; i++) {
            req.body.admins[i].event_id = eventId;
        }
        next();
    } catch(exception) {
        console.log(exception);
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error1';
        res.json(responseJson);
    }
});

// post3 : eventadmin insert
router.post('/', async function(req, res, next) {
    const admins = req.body.admins;

    try {
        const result = await EventAdmin.bulkCreate(admins);

        responseJson.result = code.SUCCESS;
        responseJson.detail = 'success';
    } catch(exception) {
        console.log(exception);
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error2';
    } finally {
        res.json(responseJson);
    }
});

router.put('/', async function(req, res, next) {
    const body = req.body;

    try {
        const result = await Event.update(
            {
                title: body.title,
                location: body.location,
                body: body.body,
                start_datetime: body.startDatetime,
                end_datetime: body.endDatetime,
            },
            {
                where: {
                    id: body.id,
                }},
        );
        responseJson.result = code.SUCCESS;
        responseJson.detail = 'success';
    } catch(exception) {
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error';
    } finally {
        res.json(responseJson);
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        const result = await Event.destroy(
            {where: {id: req.params.id}},
        );

        const adminResult = await EventAdmin.destroy(
            {where: {event_id: req.params.id}},
        );

        responseJson.result = code.SUCCESS;
        responseJson.detail = 'success';
    } catch(exception) {
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error';
    } finally {
        res.json(responseJson);
    }
});

module.exports = router;
