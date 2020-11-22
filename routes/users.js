const express = require('express');
const router = express.Router();
const {User} = require('../models');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    var result = await User.findOne({where: {username: req.query.username}});

    console.dir(result);

    if(result == null) {
          res.json({
              message: '가입된 아이디가 없습니다.'
          });
    }
    else {
          res.json({
              message: '이미 가입된 아이디가 있습니다.'
          });
    }
});

router.post('/', async function(req, res, next) {
    try {
        var result = await User.create({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            phone_number: req.body.phone_number,
        });
        res.json({
          message : '회원가입을 성공하였습니다.'
        });
    }
    catch(exception) {
        res.json({
            message : '회원가입 도중 에러가 발생하였습니다.'
        });
    }
});

module.exports = router;
