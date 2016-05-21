module.exports = function(app){
	// API Server Endpoints
	require("./user/user.server.routes")(app);
}

