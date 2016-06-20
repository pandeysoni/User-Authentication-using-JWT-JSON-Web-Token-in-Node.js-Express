const Boom = require('boom')
const Common = require('../config/common')
const Config = require('../config/config')
const Jwt = require('jsonwebtoken')
const User = require('./user.server.model').User
const privateKey = Config.key.privateKey

exports.create = function (req, res){
	req.body.password = Common.encrypt(req.body.password);
	req.body.scope = "Customer";
	User.saveUser(req.body, function(err, user) {
	    if (!err) {
	        var tokenData = {
	            username: user.username,
	            scope: [user.scope],
	            id: user._id
	        }
	        Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey));
	        return res.send(Boom.forbidden("Please confirm your email id by clicking on link in email"));
	    } else {
	        if (11000 === err.code || 11001 === err.code) {
	            return res.send(Boom.forbidden("please provide another user email"));
	        } else{
	        	return res.send(Boom.forbidden(err)); // HTTP 403
	        }
	    }
	})
}

exports.login = function (req, res){
	User.findUser(req.body.username, function(err, user) {
        if (!err) {
            console.log(user);
            if (user === null){
            	return res.send(Boom.forbidden("invalid username or password"));
            }
            if (req.body.password === Common.decrypt(user.password)) {
                if(!user.isVerified){
                	return res.send(Boom.forbidden("Your email address is not verified. please verify your email address to proceed"));
                }
                else{	
	                var tokenData = {
	                    username: user.username,
	                    scope: [user.scope],
	                    id: user._id
	                };
	                var result = {
	                    username: user.username,
	                    scope: user.scope,
	                    token: Jwt.sign(tokenData, privateKey)
	                };

	                return res.json(result);
                }
            } else{
            	return res.send(Boom.forbidden("invalid username or password"));
            }
        } else {
            if (11000 === err.code || 11001 === err.code) {
                return res.send(Boom.forbidden("please provide another user email"));
            } else {
                    console.error(err);
                    return res.send(Boom.badImplementation(err));
            } 
        }
    })
}

exports.forgotPassword = function (req, res){
	User.findUser(req.body.username, function(err, user) {
        if (!err) {
            if (user === null) {
            	return res.send(Boom.forbidden("invalid username or password"));
            }
            if (req.body.password === Common.decrypt(user.password)) {

                if(user.isVerified) {
                	return res.send(Boom.forbidden("your email address is already verified"));
                }
                else{
	                var tokenData = {
	                    userName: user.userName,
	                    scope: [user.scope],
	                    id: user._id
	                };
	                Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey));
	                return res.send(Boom.forbidden("account verification link is sucessfully send to an email id"));
                }
            }
            else{
            	return res.send(Boom.forbidden("invalid username or password"));
            } 
        } else {                
            console.error(err);
            return res.send(Boom.badImplementation(err));
        }
    })

}

exports.resendVerificationEmail = function (req, res){
 	User.findUser(req.body.username, function(err, user) {
        if (!err) {
            if (user === null){
            	return res.send(Boom.forbidden("invalid username"));
            }
            else{
	            Common.sentMailForgotPassword(user);
	            return res.send("password is send to registered email id");
            }
        } else {       
            console.error(err);
            return res.send(Boom.badImplementation(err));
         }
    })
}

exports.verifyEmail = function (req, res){
	Jwt.verify(req.params.token, privateKey, function(err, decoded) {
        if(decoded === undefined){
        	return res.send(Boom.forbidden("invalid verification link"));
        }
        if(decoded.scope[0] != "Customer"){
        	return res.send(Boom.forbidden("invalid verification link"));
        }
        User.findUserByIdAndUserName(decoded.id, decoded.username, function(err, user){
            if (err) {
                console.error(err);
                return res.send(Boom.badImplementation(err));
            }
            if (user === null){
            	return res.send(Boom.forbidden("invalid verification link"));
            }
            if (user.isVerified === true){
            	return res.send(Boom.forbidden("account is already verified"));
            }
            user.isVerified = true;
            User.updateUser(user, function(err, user){
                if (err) {
                    console.error(err);
                    return res.send(Boom.badImplementation(err));
                }
                else{
                	return res.send(Boom.forbidden("account sucessfully verified"));
                }
            })
        })       
    })
}
