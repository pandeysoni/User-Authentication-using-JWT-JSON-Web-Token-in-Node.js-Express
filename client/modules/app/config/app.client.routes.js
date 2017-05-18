'use strict';

// Setting up route
angular.module('app').config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/app/views/app.client.home.html'
		})
		.state('login', {
			url: '/login-page',
			templateUrl: 'modules/app/views/app.client.login.html'
		})
		.state('reset', {
			url: '/reset/:token',
			templateUrl: 'modules/app/views/app.client.reset.html'
		})
		.state('verify', {
			url: '/verifyEmail/:token',
			templateUrl: 'modules/app/views/app.client.home.html'
		})
	}
]);