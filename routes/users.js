const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.User.findOne({where : {phone_number : req.query.phone_number}})
    .then(result =>
      res.json({
        message : "이미 가입된 핸드폰 번호가 있습니다.",
        result : result
      })
    )
    .catch(err => {
      res.json({
        message : "가입된 핸드폰 번호가 없습니다.",
        result : err
      })
    });
});

router.post('/', function(req, res, next) {

  models.User.create({
    username : req.body.username,
    password : req.body.password,
    name : req.body.name,
    phone_number : req.body.phone_number
  }).then(result => {
    res.json(result);
  })
    .catch(result => {
      res.json(result);
    })
});

module.exports = router;
