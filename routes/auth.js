const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {User} = require('../models');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const bcrypt = require('bcrypt');

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign({data: user}, config.jwtSecret, {
        expiresIn: ONE_WEEK,
    });
}

// TODO : DELETE
router.get('/', function(req, res, next) {
    const session = req.session;
    if(session.name) {
        res.json(session.name);
    }
    else{
        res.json('login fail');
    }
});

// TODO : change redirect url
router.post('/login', async function(req, res, next) {
    try {
        const {body} = req;
        const user = await User.findOne({attributes: ['id', 'password', 'fin_account', 'name'], where: {username: body.username}});

        if(user === null) {
            res.status(404).json({
                'detail': 'No user found.',
            });
        }
        else {
            const dbPassword = user.dataValues.password;
            const inputPassword = body.password;

            // TODO: hash salt
            // let salt = user.dataValues.salt;
            // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
            // if(dbPassword === hashPassword){

            if(bcrypt.compareSync(inputPassword, dbPassword)) {
                res.json({
                    auth: true,
                    token: jwtSignUser(user),
                    user: user,
                });
            }
            else {
                res.status(401).json({
                    auth: false,
                    token: null,
                });
            }
        }
    }
    catch (error) {
        next(error);
    }
});

// TODO : change redirect url
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.clearCookie('sid');
    res.redirect('./');
});

module.exports = router;
