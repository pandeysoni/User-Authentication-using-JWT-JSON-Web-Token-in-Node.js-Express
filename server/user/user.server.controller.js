'use strict'; 
const Common = require('../config/common')
const Config = require('../config/config')
const Jwt = require('jsonwebtoken')
const User = require('./user.server.model').User
const privateKey = Config.key.privateKey
const randomstring = require("randomstring")

exports.create = (req, res) => {
	req.body.password = Common.encrypt(req.body.password);
	User.saveUser(req.body, (err, user) => {
	    if (!err) {
	        let tokenData = {
	            username: user.username,
	            id: user._id
	        }
	        Common.sentMailVerificationLink(user, Jwt.sign(tokenData, privateKey), (error, result) => {
                if(!error) return res.send(`Please confirm your email id by clicking on link in email`);
                return res.status(404).send(`Oh uh, something went wrong`);
            });
	        
	    } else {
	        if (11000 === err.code || 11001 === err.code) {
	            return res.send(`please provide another user email`);
	        } 
	        return res.status(404).send(`Oh uh, something went wrong`);// HTTP 403
	    }
	})
}

exports.login = (req, res) => {
	User.findUser({username: req.body.username}, (err, user) => {
        if (err || user == null) {
            if (11000 === err.code || 11001 === err.code) {
                return res.send(`please provide another user email`);
            }
            return res.status(404).send(`Oh uh, something went wrong`);
        }
        else{
            if (req.body.password === Common.decrypt(user.password)) {
                if(!user.isVerified){
                	return res.send(`Your email address is not verified. please verify your email address to proceed`);
                }
                else{	
	                var tokenData = {
	                    username: user.username,
	                    id: user._id
	                };
	                var result = {
	                    username: user.username,
	                    token: Jwt.sign(tokenData, privateKey)
	                };

	                return res.json(result);
                }
            } else{
            	return res.status(404).send(`Oh uh, something went wrong`);
            }
        }
    })
}

exports.forgotPassword = (req, res) => {
 	var random = Common.encrypt(randomstring.generate({length: 5, charset: 'alphabetic'}));
    User.findUserUpdate({username: req.body.username}, {password: random}, (err, user) => {
        if (!err) {
            if (user === null){
                return res.send(`invalid username`);
            }
            else{
                Common.sentMailForgotPassword(user, (error, result) => {
                    if(!error) return res.send(`password is send to registered email id`);
                    return res.status(404).send(`Oh uh, something went wrong`);
                });   
            }
        }       
        else {
            return res.status(404).send(`Oh uh, something went wrong`) 
        }    
    })
}

exports.newPassword = (req, res) => {
    User.findUser({username: req.body.username}, (err, user) => {
        if (!err) {
            if (user === null){
                return res.send(`invalid username`);
            }
            else{
                if(Common.decrypt(user.password) !== req.body.oldPassword){
                    return res.send(`wrong old password`);
                }
                else{
                    console.log(req.body.newPassword)
                    User.findUserUpdate({username: req.body.username}, {password: Common.encrypt(req.body.newPassword)}, (err, user) => {
                        console.log(user)
                        if(!err || user == null){
                            return res.send(`password changed successfully`); 
                        }
                        else{
                            return res.status(404).send(`Oh uh, something went wrong`)
                        }
                    })
                }
            }
        }       
        else {
            return res.status(404).send(`Oh uh, something went wrong`) 
        }    
    })
}

exports.verifyEmail = (req, res) => {
	Jwt.verify(req.params.token, privateKey, (err, decoded) => {
        User.findUserByIdAndUserName(decoded.id, decoded.username, (err, user) => {
            if (err || user == null) {
                return res.status(404).send(`Oh uh, something went wrong`);
            }
            else if (user.isVerified === true){
            	return res.send(`account is already verified`);
            }
            else{
                user.isVerified = true;
                User.updateUser(user, (err, user) => {
                    if (!err) {
                        return res.send(`account sucessfully verified`);
                    }
                    else{ return res.status(404).send(`Oh uh, something went wrong`); }     
                })
            }
        })       
    })
}
