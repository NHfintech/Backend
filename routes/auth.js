const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {User} = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign({data: user}, config.jwtSecret, {
      expiresIn: ONE_WEEK
    })
}

// function getUser(req, res) {
//     if (req.headers && req.headers.authorization) {
//       let authorization = req.headers.authorization
//       let decoded = ''
//       try {
//         decoded = jwt.verify(authorization, config.jwtSecret);
//       } catch (e) {
//         return {detail: 'unauthorized'}
//       }
//       return {detail: 'success', user: decoded.data}
//       // Fetch the user by id
//     }
//     return {detail: 'no header'};
// }

//TODO : DELETE
router.get('/', function(req, res, next) {
    let session = req.session;
    if(session.name)
    {
        res.json(session.name)
    }
    else{
        res.json("login fail")
    }
});

//TODO : change redirect url
router.post('/login', async function(req, res, next) {
    try {

        const {body} = req;
        const user = await User.findOne({attributes : ['id', 'password'], where : {username : body.username}});

        if(user === null) {
            console.log("cannot find user");
            res.status(404).send('No user found.')
        }
        else {        
            console.log(user.dataValues);
            const dbPassword = user.dataValues.password;
            const inputPassword = body.password;

            // TODO: hash salt
            // let salt = user.dataValues.salt;
            // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
            // if(dbPassword === hashPassword){ 

            if(dbPassword === inputPassword){ 
                console.log("pw correct");        
                res.json({
                    auth: true,
                    token: jwtSignUser(user),
                    user: user
                  });
            }
            else {
                console.log("pw incorrect");
                res.status(401).send({auth: false, token: null})       
            }
        }
    }    
    catch (error) {
        console.log("Login Error");
        next(error);
    }
});

//TODO : change redirect url
router.get("/logout", function(req,res,next){
    req.session.destroy();
    res.clearCookie('sid');  
    res.redirect('./');
})

module.exports = router;
