'use strict'; 
const Common = require('../config/common')
const Config = require('../config/config')
const Jwt = require('jsonwebtoken')
const User = require('./user.server.model').User
const privateKey = Config.key.privateKey
const async = require('async')

exports.create = (req, res) => {
	req.body.password = Common.encrypt(req.body.password);
	User.saveUser(req.body, (err, user) => {
	    if (!err) {
	        let tokenData = {
	            username: user.username,
	            id: user._id
	        }
	        Common.sentMailVerificationLink(user, Jwt.sign(tokenData, privateKey), (error, result) => {
                if(!error) return res.json({message: `Please confirm your email id by clicking on link in email`});
                else return res.status(500).send(`Oh uh, something went wrong`);
            });
	        
	    } else {
            if(err.name == 'ValidationError'){
                 return res.status(409).send(`please provide another user email`);
            }
	        else return res.status(500).send(`Oh uh, something went wrong`);// HTTP 403
	    }
	})
}

exports.login = (req, res) => {
	User.findUser({username: req.body.username}, (err, user) => {
        if (err) {
            return res.status(500).send(`Oh uh, something went wrong`);
        }
        else if (user == null){
            return res.status(422).send(`Email not recognised`);
        }
        else{
            if (req.body.password === Common.decrypt(user.password)) {
                if(!user.isVerified){
                	return res.status(401).send(`Your email address is not verified. please verify your email address to proceed`);
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
            	return res.status(500).send(`Oh uh, something went wrong`);
            }
        }
    })
}

exports.forgotPassword = (req, res) => {
    User.findUser({username: req.body.username}, (err, user) => {
        if (!err) {
            if (user === null){
                return res.status(422).send(`Email not recognised`);
            }
            else{
                let tokenData = {
                    username: user.username,
                    id: user._id
                }
                Common.sentMailForgotPassword(user, Jwt.sign(tokenData, privateKey), (error, result) => {
                    if(!error) return res.json({message: `reset password link sent to your mail.`});
                    return res.status(500).send(`Oh uh, something went wrong`);
                });   
            }
        }       
        else {
            return res.status(500).send(`Oh uh, something went wrong`) 
        }    
    })
}

exports.newPassword = (req, res) => {
    Jwt.verify(req.body.token, privateKey, (err, decoded) => {
        if(err)  return res.status(500).send(`Oh uh, something went wrong`);
        else{
             User.findUserByIdAndUserName(decoded.id, decoded.username, (err, user) => {
                if (err) {
                    return res.status(500).send(`Oh uh, something went wrong`);
                }
                else if (user == null){
                    return res.status(422).send(`Email not recognised`);
                }
                else if (req.body.newPassword !== req.body.confirmNew){
                    return res.status(400).send(`Password Mismatch`);
                }
                else{
                    user.password = Common.encrypt(req.body.newPassword);
                    User.updateUser(user, (err, user) => {
                        if (!err) {
                            return res.json({message: `password changed successfully`});
                        }
                        else{ return res.status(500).send(`Oh uh, something went wrong`); }     
                    })
                }
            }) 
        }   
    })
}

exports.verifyEmail = (req, res) => {
	Jwt.verify(req.body.token, privateKey, (err, decoded) => {
        if(err)  return res.status(500).send(`Oh uh, something went wrong`);
        else{
            User.findUserByIdAndUserName(decoded.id, decoded.username, (err, user) => {
                if (err) {
                    return res.status(500).send(`Oh uh, something went wrong`);
                }
                else if (user == null){
                    return res.status(422).send(`Email not recognised`);
                }
                else if (user.isVerified === true){
                    return res.json({message: `account is already verified`});
                }
                else{
                    user.isVerified = true;
                    User.updateUser(user, (err, user) => {
                        if (!err) {
                            return res.json({message:`account sucessfully verified`});
                        }
                        else{ return res.status(500).send(`Oh uh, something went wrong`); }     
                    })
                }
            })   
        }    
    })
}
