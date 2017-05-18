'use strict';


angular.module('app').controller('AppController', ['$scope', 'userService', 'growl', '$state', '$stateParams',
	($scope, userService, growl, $state, $stateParams) => {
		$scope.signup = (data, form) => {
			userService.save({url: 'user'}, data).$promise.then((result) => { 
					growl.success(result.message, {ttl: 5000})
				}).catch((error) => {
	                growl.error(error.data, {ttl: 5000});
			})
		}

		$scope.login = (data, form) => {
			userService.save({url: 'login'}, data).$promise.then((result) => { 
				console.log(result.username)
				if(result.username){
					$state.go('login');
				}
				else{
					growl.error(`Oh uh, something went wrong`);
				}
				}).catch((error) => {
	                growl.error(error.data, {ttl: 5000});
			})
		}

		$scope.forgot = (data, form) => {
			userService.save({url: 'forgot'}, data).$promise.then((result) => { 
					growl.success(result.message, {ttl: 5000})
				}).catch((error) => {
	                growl.error(error.data, {ttl: 5000});
			})
		}

		$scope.reset = (data, form) => {
			data.token = $stateParams.token
			userService.save({url: 'reset'}, data).$promise.then((result) => { 
					growl.success(result.message, {ttl: 5000})
					$state.go('home')
				}).catch((error) => {
	                growl.error(error.data, {ttl: 5000});
			})
		}
		$scope.goToSignUp = () => {
			$scope.signupDiv = true;
			$scope.resetDiv = false;
		}
		$scope.goToSignIn = () => {
			$scope.signupDiv = false;
			$scope.resetDiv = false;
		}
		$scope.goToForgotPassword = () => {
			$scope.resetDiv = true;
		}
		$scope.load = () => {
			$scope.signupDiv = false;
			$scope.resetDiv = false;
			if($state.$current.name == 'verify'){
				var data = {token: $stateParams.token}
				userService.save({url: 'verifyLink'}, data).$promise.then((result) => { 
					growl.success(result.message, {ttl: 5000})
					$state.go('home')
				}).catch((error) => {
	                growl.error(error.data, {ttl: 5000});
			})
			}
		}
		$scope.load();
	}
]);