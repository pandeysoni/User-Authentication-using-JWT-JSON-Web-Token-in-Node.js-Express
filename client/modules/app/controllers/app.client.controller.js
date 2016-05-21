'use strict';


angular.module('app').controller('AppController', ['$scope', 'userService', 'growl', '$state',
	function($scope, userService, growl, $state) {
		$scope.signup = function(data, form){
			userService.save({url: 'user'}, data).$promise.then(function(result){ 
				if(result.output.payload.message === "Please confirm your email id by clicking on link in email")
				{
					growl.addSuccessMessage(result.output.payload.message);
				}
				else{
					growl.addErrorMessage(result.output.payload.message);
				}
				}).catch(function(error){
	                growl.addErrorMessage('oops something went wrong');
			})
		}

		$scope.login = function(data, form){
			userService.save({url: 'login'}, data).$promise.then(function(result){ 
				console.log(result);
				if(result.username){
					$state.go('login');
				}
				else{
					growl.addSuccessMessage(result.output.payload.message);
				}
				}).catch(function(error){
	                growl.addErrorMessage('oops something went wrong');
			})
		}

		$scope.goToSignUp = function(){
			$scope.signupDiv = true;
		}
		$scope.goToSignIn = function(){
			$scope.signupDiv = false;
		}
		$scope.load = function(){
			$scope.signupDiv = false;
		}
		$scope.load();
	}
]);