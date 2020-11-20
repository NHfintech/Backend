const express = require('express');
const router = express.Router();
const {User} = require('../models');

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
        const result = await User.findOne({attributes : ['id', 'password'], where : {username : body.username}});

        if(result === null) {
            console.log("cannot find user");
            res.json("cannot find user");
        }
        else {        
            console.log(result.dataValues);
            let dbPassword = result.dataValues.password;
            let inputPassword = body.password;

            // TODO: hash salt
            // let salt = result.dataValues.salt;
            // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
            // if(dbPassword === hashPassword){ 

            if(dbPassword === inputPassword){     
                console.log("pw correct");        
                req.session.name = body.username;
            }
            else {
                console.log("pw incorrect");            
            }
            res.redirect("/auth");
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