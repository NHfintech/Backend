const express = require('express');
const router = express.Router();
const {User} = require('../models');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    await User.findOne({where: {username: req.query.username}})
        .then((result) =>
            res.json({
                message: '이미 가입된 아이디가 있습니다.',
                result: result,
            }),
        )
        .catch((err) => {
            res.json({
                message: '가입된 아이디가 없습니다.',
                result: err,
            });
        });
});

router.post('/', async function(req, res, next) {
    await User.create({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        phone_number: req.body.phone_number,
    })
        .then((result) => {
            res.json(result);
        })
        .catch((result) => {
            res.json(result);
        });
});

module.exports = router;
