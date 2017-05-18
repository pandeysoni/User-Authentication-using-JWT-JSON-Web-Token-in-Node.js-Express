'use strict';

// Authentication service for user variables
angular.module('app').factory('userService', ['$resource', function($resource) {
	return $resource(':url/:id', {},
		{
			'getArray': { isArray: true },
			'save': { method: 'POST' },
			'get': { method: 'GET' }
		});
},
]);