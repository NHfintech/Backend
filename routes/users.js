const express = require('express');
const router = express.Router();
const {sequelize, User, EventAdmin} = require('../models');
const bcrypt = require('bcrypt');
const util = require('../utils.js');
const code = util.code;

/* GET users listing. */
// 핸드폰번호 중복체크
// 회원인지 확인하고 문자 아니면 알림 보낼때 사용
router.get('/overlap/phone', async function(req, res, next) {
    const responseJson = {};
    if(!util.phoneNumberCheck(req.query.phone_number)) {
        responseJson.result = code.PHONE_NUMBER_INVALID;
        responseJson.detail = 'phone number invalid';
    }
    else {
        const result = await User.findOne(
            {where: {phone_number: req.query.phone_number}},
        );

        if(result == null) {
            responseJson.result = code.SUCCESS;
            responseJson.detail = 'no exist';
        }
        else {
            responseJson.result = code.PHONE_NUMBER_ALREADY_EXIST;
            responseJson.detail = 'phone number already exist';
        }
    }
    res.json(responseJson);
});

// 아이디 중복체크
router.get('/overlap/username', async function(req, res, next) {
    const responseJson = {};
    const result = await User.findOne(
        {where: {username: req.query.username}},
    );

    if(result == null) {
        responseJson.result = code.SUCCESS;
        responseJson.detail = 'no exist';
    }
    else {
        responseJson.result = code.USERNAME_ALREADY_EXIST;
        responseJson.detail = 'username already exist';
    }
    res.json(responseJson);
});

// 회원가입
router.post('/signup', async function(req, res, next) {
    const responseJson = {};
    const transaction = await sequelize.transaction();
    try {
        if(util.phoneNumberCheck(req.body.phone_number)) {
            const bcPw = bcrypt.hashSync(req.body.password, util.saltRounds);
            const result = await User.create({
                username: req.body.username,
                password: bcPw,
                name: req.body.name,
                phone_number: req.body.phone_number,
            }, {transaction});
            responseJson.result = code.SUCCESS;
            responseJson.detail = 'signup success';

            const userId = result.dataValues.id;
            const isInvited = await EventAdmin.findOne(
                {where: {user_phone: req.body.phone_number}},
            );

            if(isInvited) {
                await EventAdmin.update(
                    {
                        user_id: userId,
                    },
                    {
                        where: {
                            user_phone: req.body.phone_number,
                        },
                        transaction,
                    },
                );
            }
            await transaction.commit();
        }
        else {
            responseJson.result = code.PHONE_NUMBER_INVALID;
            responseJson.detail = 'phone number invalid';
        }
    }
    catch(exception) {
        if (transaction) {
            await transaction.rollback();
        }
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = 'sign up error';
    }
    finally {
        res.json(responseJson);
    }
});

router.put('/:id/token', async function(req, res, next) {
    const responseJson = {};
    try {
        const token = req.body.token;
        console.dir(req.body);
        const result = User.update(
            {
                firebase_token: token,
            },
            {
                where: {
                    id: req.params.id,
                },
            },
        );

        responseJson.result = code.SUCCESS;
        responseJson.detail = 'update firebase token success';
        responseJson.data = result;
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
