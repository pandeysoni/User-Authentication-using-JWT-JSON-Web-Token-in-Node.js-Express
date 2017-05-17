'use strict'; 
const User = require('./user.server.controller')

module.exports = function(app){
	// API Server Endpoints
	app.post('/user', User.create);
	app.post('/login', User.login);
	app.post('/forgotPassword', User.forgotPassword);
	app.post('/newPassword', User.newPassword);
	app.get('/verifyEmail/:token', User.verifyEmail);
}