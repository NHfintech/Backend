const express = require('express');
const router = express.Router();
const moment = require('moment');

const {BreakDown, User, Event, EventAdmin} = require('../models');
const util = require('../utils');
const code = util.code;

masterCheck = async function(userId, eventId) {
    const check = await Event.findOne({
        where: {user_id: userId, id: eventId},
    });
    return check !== null;
};

adminCheck = async function(userId, eventId) {
    const check = await EventAdmin.findOne(
        {
            where: {
                user_id: userId,
                event_id: eventId,
            },
        },
    );
    return check !== null;
};

router.get('/event/:eventId', async function(req, res, next) {
    const responseJson = {};
    const eventId = req.params.eventId;
    const isMaster = !await masterCheck(res.locals.user.id, eventId);
    const isAdmin = !await adminCheck(res.locals.user.id, eventId);
    if(isMaster && isAdmin) {
        responseJson.result = code.NO_AUTH;
        responseJson.detail = 'no auth';
        res.json(responseJson);
        return;
    }

    try {
        const result = await User.findAll(
            {
                include: [
                    {
                        model: BreakDown,
                        where: {
                            event_id: eventId,
                            sender_name: null,
                        },
                        attributes: ['id', 'transfer_datetime', 'message', 'money'],
                    },
                ],
                attributes: ['name'],
            },
        );
        const list = [];

        for(let i = 0; i < result.length; i++) {
            const {name, breakdowns} = result[i].dataValues;
            for(let j = 0; j < breakdowns.length; j++) {
                const temp = {};
                temp.id = breakdowns[j].id;
                temp.name = name;
                temp.money = breakdowns[j].money;
                temp.message = breakdowns[j].message;
                temp.transfer_datetime = breakdowns[j].transfer_datetime;
                temp.isDirectInput = false;

                list.push(temp);
            }
        }

        const result2 = await BreakDown.findAll(
            {
                where: {
                    event_id: eventId,
                    is_direct_input: false,
                },
                attributes: ['id', 'sender_name', 'transfer_datetime', 'message', 'money'],
            },
        );

        for(let i = 0; i < result2.length; i++) {
            const temp = {};
            const {id, sender_name, transfer_datetime, message, money} = result2[i].dataValues;

            temp.id = id;
            temp.name = sender_name;
            temp.transfer_datetime = transfer_datetime;
            temp.message = message;
            temp.money = money;
            temp.isDirectInput = true;

            list.push(temp);
        }

        console.log(list);
        responseJson.result = code.SUCCESS;
        responseJson.detail = 'success';
        responseJson.data = list;
    }
    catch(exception) {
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error';
    }
    finally {
        res.json(responseJson);
    }
});

router.get('/sender', async function(req, res, next) {
    const responseJson = {};
    const userId = res.locals.user.id;

    try {
        const result = await Event.findAll(
            {
                include: [
                    {
                        model: BreakDown,
                        where: {
                            sender_id: userId,
                        },
                        attributes: ['event_id', 'sender_name', 'transfer_datetime', 'message', 'money', 'is_direct_input'],
                    },
                ],
                attributes: ['title'],
            },
        );

        const list = [];

        for(let i = 0; i < result.length; i++) {
            const {breakdowns} = result[i].dataValues;
            for(let j = 0; j < breakdowns.length; j++) {
                const temp = {};
                const {event_id, sender_name, transfer_datetime, message, money, is_direct_input} = breakdowns[j];
                temp.title = result[i].dataValues.title;
                temp.event_id = event_id;
                temp.sender_name = sender_name;
                temp.transfer_datetime = transfer_datetime;
                temp.message = message;
                temp.money = money;
                temp.is_direct_input = is_direct_input;

                list.push(temp);
            }
        }
        console.log(list);
        responseJson.result = code.SUCCESS;
        responseJson.detail = 'success';
        responseJson.data = list;
    }
    catch(exception) {
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error';
    }
    finally {
        res.json(responseJson);
    }
});

router.post('/', async function(req, res, next) {
    const responseJson = {};
    const {name, eventId, money} = req.body;
    if(!await masterCheck(res.locals.user.id, eventId)) {
        responseJson.result = code.NO_AUTH;
        responseJson.detail = 'no auth';
        res.json(responseJson);
        return;
    }

    try {
        const transferTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = {
            event_id: Number(eventId),
            sender_name: name,
            transfer_datetime: transferTime,
            money: Number(money),
            is_direct_input: true,
        };

        const result = await BreakDown.create(data);

        responseJson.result = code.SUCCESS;
        responseJson.detail = 'breakdown insert success';
    }
    catch(exception) {
        console.log(exception);
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error';
    }
    finally {
        res.json(responseJson);
    }
});

router.delete('/:id', async function(req, res, next) {
    const responseJson = {};

    try {
        const result = await BreakDown.findOne(
            {
                where: {
                    id: req.params.id,
                },
                attributes: ['id', 'event_id'],
            },
        );

        const eventId = result.dataValues.event_id;

        if(!await masterCheck(res.locals.user.id, eventId)) {
            responseJson.result = code.NO_AUTH;
            responseJson.detail = 'no auth';
            res.json(responseJson);
            return;
        }

        const result2 = await BreakDown.destroy(
            {
                where: {
                    id: req.params.id,
                    is_direct_input: true,
                },
            },
        );
        if(result2 === 0) {
            responseJson.result = code.NO_DATA;
            responseJson.detail = 'no direct input, or no data';
        }
        else if(result2 === 1) {
            responseJson.result = code.SUCCESS;
            responseJson.detail = 'success';
        }
        else {
            responseJson.result = code.UNKNOWN_ERROR;
            responseJson.detail = 'success';
        }
    }
    catch(exception) {
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'unknown error';
    }
    finally {
        res.json(responseJson);
    }
});

module.exports = router;
