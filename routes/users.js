const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcrypt = require('bcrypt');
const code = require('../config/code');
const saltRounds = 10;

const responseJson = {};

// 핸드폰 번호 체크 정규식
function phoneNumberCheck(phone) {
    const regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
    if(!regExp.test(phone)) {
        return false;
    }
    return true;
}

/* GET users listing. */
// 핸드폰번호 중복체크
// 회원인지 확인하고 문자 아니면 알림 보낼때 사용
router.get('/overlap/phone', async function(req, res, next) {
    if(!phoneNumberCheck(req.query.phone_number)) {
        responseJson.result = code.PHONE_NUMBER_INVALID;
        responseJson.detail = 'phone number invalid';
    } else {
        const result = await User.findOne(
            {where: {phone_number: req.query.phone_number}},
        );

        if(result == null) {
            responseJson.result = code.SUCCESS;
            responseJson.detail = 'no exist';
        } else {
            responseJson.result = code.PHONE_NUMBER_ALREADY_EXIST;
            responseJson.detail = 'phone number already exist';
        }
    }
    res.json(responseJson);
});

// 아이디 중복체크
router.get('/overlap/username', async function(req, res, next) {
    const result = await User.findOne(
        {where: {username: req.query.username}},
    );

    if(result == null) {
        responseJson.result = code.SUCCESS;
        responseJson.detail = 'no exist';
    } else {
        responseJson.result = code.USERNAME_ALREADY_EXIST;
        responseJson.detail = 'username already exist';
    }
    res.json(responseJson);
});

// 회원가입
router.post('/signup', async function(req, res, next) {
    try {
        if(phoneNumberCheck(req.body.phone_number)) {
            const result = await User.create({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, saltRounds),
                name: req.body.name,
                phone_number: req.body.phone_number,
            });
            responseJson.result = code.SUCCESS;
            responseJson.detail = 'signup success';
        } else {
            responseJson.result = code.PHONE_NUMBER_INVALID;
            responseJson.detail = 'phone number invalid';
        }
    } catch(exception) {
        responseJson.result = code.UNKNOWN_ERROR;
        responseJson.detail = exception.errors[0].message;
    } finally {
        res.json(responseJson);
    }
});

module.exports = router;
