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
						$scope.role = data.arr.role;
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
			if ($routeParams.reset){
				usersServ.reset($routeParams.reset, function(data){
					messagesServ.showMessages(data.status, data.msg, 2000, function(){
						$location.url('home');
					});
				});
			}
			if ($location.path() === '/profile') {
				usersServ.getProfile(function(data){
					if (data.status === 'error'){
						messagesServ.showMessages(data.status, data.msg);
					}
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

	this.init();
});



rainApp.controller('cartsCtrl', function($scope, $window, localStorageService, messagesServ, cartsServ, ordersServ, cartsFact){
	this.init = function(){
		const isAuth = localStorageService.get('token');
		const uid = isAuth ? isAuth.split('.')[0] : -1;
		$scope.cart = cartsFact.cart;

		if (!localStorageService.get('carts')){
			localStorageService.set('carts', []);
		}
		if (!cartsServ.getCartByUid(localStorageService.get('carts'), uid, $scope.cart)){
			const newCarts = cartsServ.updateCartsArray(localStorageService.get('carts'), uid, {
				uid: uid,
				products: [],
				sum: 0
			});
			localStorageService.set('carts', newCarts);
		}
		$scope.orderStatus = 0;
		$scope.order = {
			fio: '',
			phone: '',
			delivery: '',
			city: '',
			department: '',
			comment: '',
			payType: ''
		};
	}
	$scope.addToCart = function(product){
		product = angular.fromJson(product);
		$scope.cart.products.push({
			id: product.id,
			title: product.title,
			price: product.price,
			count: 1
		});
		cartsServ.reorderCart($scope.cart);
		const newCarts = cartsServ.updateCartsArray(localStorageService.get('carts'), $scope.cart.uid, $scope.cart)
		localStorageService.set('carts', newCarts);
	}
	$scope.removeFromCart = function(productId){
		$scope.cart.products = $scope.cart.products.filter(product => product.id !== productId);
		cartsServ.reorderCart($scope.cart);
		const newCarts = cartsServ.updateCartsArray(localStorageService.get('carts'), $scope.cart.uid, $scope.cart)
		localStorageService.set('carts', newCarts);
	}
	$scope.changeCountOfCartItem = function(index, keyCode){
		switch (keyCode){
			case 38: $scope.cart.products[index].count++; break;
			case 40:
				if ($scope.cart.products[index].count > 1){
					$scope.cart.products[index].count--;
				}
			break;
			case 49: $scope.cart.products[index].count = 1; break;
			case 50: $scope.cart.products[index].count = 2; break;
			case 51: $scope.cart.products[index].count = 3; break;
			case 52: $scope.cart.products[index].count = 4; break;
			case 53: $scope.cart.products[index].count = 5; break;
			case 54: $scope.cart.products[index].count = 6; break;
			case 55: $scope.cart.products[index].count = 7; break;
			case 56: $scope.cart.products[index].count = 8; break;
			case 57: $scope.cart.products[index].count = 9; break;
			default: $scope.cart.products[index].count = 1; break;
		}
		cartsServ.reorderCart($scope.cart);
		const newCarts = cartsServ.updateCartsArray(localStorageService.get('carts'), $scope.cart.uid, $scope.cart)
		localStorageService.set('carts', newCarts);
	}
	$scope.createOrder = function(step){
		if (step === 'enterData'){
			$scope.orderStatus++;
		} else if (step === 'sendData'){
			if (!$scope.order.fio || !$scope.order.phone || !$scope.order.delivery || !$scope.order.city || !$scope.order.department || !$scope.order.payType){
				messagesServ.showMessages('error', 'Помилка! Поля "Прізвищє Імʼя По-батькові", "Телефон", "Сервіс доставки", "Місто відправки", "Відділення №" та "Форма оплати" обов\'язкові для заповнення!');
			} else if (!/^\+380\d{9}$/.test($scope.order.phone)){
				messagesServ.showMessages('error', 'Помилка! Значення поля "Телефон" має бути наступного формату: +380XXXXXXXXX!');
			} else{
				$scope.order.sum = $scope.cart.sum;
				$scope.order.products = $scope.cart.products;
				ordersServ.createOrder($scope.order, function(data){
					if (data.status == 'success'){
						$scope.orderStatus++;
					}
					messagesServ.showMessages(data.status, data.msg, $scope.order.payType === 'card' ? 5000 : 3000, function(){
						if (data.status == 'success'){
							const newCarts = cartsServ.removeCartByUid(localStorageService.get('carts'), $scope.cart.uid);
							localStorageService.set('carts', newCarts);
							if ($scope.order.payType === 'card'){
								$window.location.href = 'https://www.liqpay.ua/ru/checkout/rainstore';
							} else{
								$window.location.href = '#/home';
							}
						}
					});
				});
			}
		}

	}

	this.init();
});



rainApp.controller('ordersCtrl', function($scope, localStorageService, messagesServ, ordersServ, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		$scope.deliveries = {
			intime: 'ІнТайм',
			novaposhta: 'Нова Пошта'
		}
		$scope.statuses = {
			confirming: 'Очікує підтвердження',
			preparing: 'Готується до відправки',
			delivering: 'Відправлено',
			done: 'Завершено'
		}
		$scope.payTypes = {
			cash: 'Готівка',
			card: 'Карта'
		}
		$scope.orders = [];
		$scope.user = {};
		if ($scope.isAuth){
			usersServ.getProfile(function(data){
				if (data.status == 'success'){
					$scope.user.id = data.arr['id'];
					$scope.user.role = data.arr['role'];
					if ($scope.user.role === 'user'){
						ordersServ.getOrders($scope.user.id, function(data){
							if (data.status == 'success'){
								$scope.orders = data.arr ? data.arr : [];
							} else{
								messagesServ.showMessages(data.status, data.msg);
							}
						});
					} else if ($scope.user.role === 'manager'){
						ordersServ.getOrders(function(data){
							if (data.status == 'success'){
								data.arr            = data.arr ? data.arr : [];
								$scope.orders       = [];
								$scope.guestOrders  = [];
								$scope.restOfOrders = [];
								data.arr.map(order => {
									if (order.uid === '-1'){
										$scope.guestOrders.push(order);
									} else if (order.uid === $scope.user.id){
										$scope.orders.push(order);
									} else {
										$scope.restOfOrders.push(order);
									}
								});
							} else{
								messagesServ.showMessages(data.status, data.msg);
							}
						});
					}
				} else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		} else {
			ordersServ.getOrders('-1', function(data){
				if (data.status === 'error'){
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.getOrderProducts = function(id){
		ordersServ.getOrderProducts(id, function(data){
			if (data.status == 'success'){
				$scope.orderProducts = data.arr ? data.arr : [];
			} else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.showChangeStatusList = function($event){
		const oid = angular.element($event.currentTarget).parent().find('td:first-child').text();
		const statusesList = angular.element('<ul></ul>');
		for (let key in $scope.statuses){
			statusesList.append('<li key="' + key + '">' + $scope.statuses[key] + '</li>');
		}
		angular.element($event.currentTarget).append(statusesList);
		angular.element($event.currentTarget).find('li').click(function(){
			const status = angular.element(this).attr('key');
			const title = angular.element(this).text();
			ordersServ.changeOrderStatus(oid, status, function(data){
				if (data.status == 'success'){
					angular.element($event.currentTarget).html(title);
				} else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		});
	}
	$scope.hideChangeStatusList = function($event){
		angular.element($event.currentTarget).find('ul').remove();
	}

	this.init();
});
