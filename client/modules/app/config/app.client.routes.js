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
			url: '/login',
			templateUrl: 'modules/app/views/app.client.login.html'
		})
	}
]);