const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '.', 'config', 'config.json'))[env];
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey');

const value = {};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://kkotgil-bdb2e.firebaseio.com'
});

value.code = {
    'UNKNOWN_ERROR': -1,
    'SUCCESS': 0,
    'NO_USER': 1,
    'INCORRECT_PASSWORD': 2,
    'USERNAME_ALREADY_EXIST': 3,
    'USERNAME_INVALID': 4,
    'PHONE_NUMBER_ALREADY_EXIST': 5,
    'PHONE_NUMBER_INVALID': 6,
    'NAME_INVALID': 7,
    'NO_DATA': 8,
    'INVALID_QUERY': 9,
    'NO_AUTH': 10,
    'NH_API_ERROR': 11,
    'DB_ERROR': 12,
};

value.phoneNumberCheck = function (phone) {
    const regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
    if(!regExp.test(phone)) {
        return false;
    }
    return true;
};

value.getUser = function (req) {
    if (req.headers && req.headers.authorization) {
        const authorization = req.headers.authorization;
        let decoded = '';
        try {
            decoded = jwt.verify(authorization, config.jwtSecret);
        }
        catch (e) {
            return {detail: 'unauthorized'};
        }
        return {detail: 'success', user: decoded.data};
        // Fetch the user by id
    }
    return {detail: 'no header'};
};

value.saltRounds = 10;

value.sendFcm = async function(title, body, link, fbTokenList) {
    const fcmMessage = {
        data: {
            title: title,
            body: body,
            link: link,
        },
        tokens: fbTokenList,
    };
    try {
        const result = await admin.messaging().sendMulticast(fcmMessage);

        for(let i = 0; i < result.responses.length; i++) {
            if(!result.responses[i].success) {
                console.log(result.responses[i].error);
            }
        }
        console.log('Send FCM Success');

        return value.code.SUCCESS;
    }
    catch(exception) {
        console.log(exception);
        return value.code.UNKNOWN_ERROR;
    }
};

module.exports = value;
