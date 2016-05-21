var User = require('./user.server.controller');

module.exports = function(app){
	// API Server Endpoints
	app.post('/user', User.create);
	app.post('/login', User.login);
	app.post('/forgotPassword', User.forgotPassword);
	app.post('/resendVerificationEmail', User.resendVerificationEmail);
	app.get('/verifyEmail/:token', User.verifyEmail);
}