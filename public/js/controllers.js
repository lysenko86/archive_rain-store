"use strict";



rainApp.controller('menuCtrl', function($location, $scope, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		angular.element('nav.navbar li a:not(.dropdown-toggle)').click(function(){
			if (angular.element('nav.navbar .navbar-collapse.collapse').hasClass('in')){
				angular.element('nav.navbar .navbar-header button.navbar-toggle').click();
			}
		});
	}
	$scope.setActive = function(path){
		return ($location.path().substr(0, path.length) === path) ? 'active' : '';
	}

	this.init();
});



rainApp.controller('homeCtrl', function($location, $scope, messagesServ, productsServ){
	this.init = function(){
		$scope.products = [];
		productsServ.getProducts(function(data){
			if (data.status == 'success'){
				$scope.products = data.arr ? data.arr : [];
			} else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getProduct = function(id){
		$location.url('product/' + id);
	}

	this.init();
});



rainApp.controller('usersCtrl', function($location, $routeParams, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			if ($location.path() === '/logout'){
				usersServ.logout(function(data){
					if (data.status == 'success'){
						localStorageService.remove('token');
						$window.location.href = '/';
					} else{
						messagesServ.showMessages(data.status, data.msg);
					}
				});
			} else if ($location.path() === '/profile') {
				usersServ.getProfile(function(data){
					if (data.status == 'success'){
						$scope.email   = data.arr.email;
						$scope.created = data.arr.created;
					} else{
						messagesServ.showMessages(data.status, data.msg);
					}
				});
			} else {
				$location.url('home');
			}
		} else {
			$scope.user = {email: '', password: ''};
			$scope.auth = {notConfirmed: false, email: ''};
			if ($routeParams.confirm){
				usersServ.confirm($routeParams.confirm, function(data){
					messagesServ.showMessages(data.status, data.msg, 2000, function(){
						$location.url('home');
					});
				});
			}
			if ($routeParams.password){
				usersServ.reset($routeParams.password, function(data){
					messagesServ.showMessages(data.status, data.msg, 2000, function(){
						$location.url('home');
					});
				});
			}
		}
	}
	$scope.signup = function(){
		if (!$scope.user.email || !$scope.user.password){
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		} else if (!/^\S+@\S+$/.test($scope.user.email)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Email" має бути наступного формату: email@email.com!');
		} else if (!$scope.user.agree){
			messagesServ.showMessages('error', 'Помилка! Ви повинні прийняти умови користувацької угоди.');
		} else{
			usersServ.signup($scope.user, function(data){
				$scope.user.email = $scope.user.password = $scope.user.agree = '';
				messagesServ.showMessages(data.status, data.msg, 6000, function(){
					if (data.status == 'success'){
						$location.url('home');
					}
				});
			});
		}
	}
	$scope.sendConfirmMail = function(){
		usersServ.sendConfirmMail($scope.auth.email, function(data){
			$scope.auth.notConfirmed = false;
			$scope.auth.email = '';
			messagesServ.showMessages(data.status, data.msg);
		});
	}
	$scope.signin = function(){
		if (!$scope.user.email || !$scope.user.password){
			$scope.auth.notConfirmed = false;
			$scope.auth.email = '';
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		} else{
			usersServ.signin($scope.user, function(data){
				$scope.user.password = '';
				$scope.auth.notConfirmed = data.notConfirmed;
				$scope.auth.email = data.email;
				if (data.status == 'success'){
					localStorageService.set('token', data.arr.token);
					$window.location.href = '/';
				} else{
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.resetPassword = function(){
		if (!$scope.email){
			messagesServ.showMessages('error', 'Помилка! Поле "Email" обов\'язкове для заповнення!');
		} else{
			usersServ.sendPasswordMail($scope.email, function(data){
				if (data.status == 'success'){
					$scope.email = '';
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}

	this.init();
});



rainApp.controller('productsCtrl', function($location, $routeParams, $scope, messagesServ, productsServ){
	this.init = function(){
		$scope.productId = $routeParams.id;
		if ($scope.productId){
			$scope.product = {};
			productsServ.getProduct($scope.productId, function(data){
				if (data.status == 'success'){
					$scope.product = data.arr ? data.arr : [];
				} else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		} else {
			$scope.products = [];
			productsServ.getProducts(function(data){
				if (data.status == 'success'){
					$scope.products = data.arr ? data.arr : [];
				} else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.getProduct = function(id){
		$location.url('product/' + id);
	}
	$scope.addToCart = function(id){
		console.log('add id='+id+' to Cart');
	}

	this.init();
});
