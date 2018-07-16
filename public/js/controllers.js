"use strict";



rainApp.controller('menuCtrl', function($location, $scope, localStorageService/*, accountsServ*/){
	this.init = function(){
		/*$scope.isAuth = localStorageService.get('token');
		accountsServ.getAccountsPanel();
		angular.element('nav.navbar li a:not(.dropdown-toggle)').click(function(){
			if (angular.element('nav.navbar .navbar-collapse.collapse').hasClass('in')){
				angular.element('nav.navbar .navbar-header button.navbar-toggle').click();
			}
		});*/
	}
	$scope.setActive = function(path){
		return ($location.path().substr(0, path.length) === path) ? 'active' : '';
	}

	this.init();
});



rainApp.controller('homeCtrl', function($scope, messagesServ, localStorageService, usersServ, productsServ){
	this.init = function(){
		$scope.products = [];
		productsServ.getProducts(function(data){
			if (data.status == 'success'){
				data.arr          = data.arr ? data.arr : [];
				$scope.products = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}

	this.init();
});



rainApp.controller('signinCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		$scope.user = {
			email: '',
			password: ''
		};
		$scope.auth = {
			notConfirmed: false,
			email: ''
		};
	}
	$scope.signin = function(){
		if (!$scope.user.email || !$scope.user.password){
			$scope.auth.notConfirmed = false;
			$scope.auth.email        = '';
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		}
		else{
			usersServ.signin($scope.user, function(data){
				$scope.user.password = '';
				$scope.auth.notConfirmed = data.notConfirmed;
				$scope.auth.email        = data.email;
				if (data.status == 'success'){
					localStorageService.set('token', data.arr.token);
					$window.location.href = '/';
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.sendConfirmMail = function(){
		usersServ.sendConfirmMail($scope.auth.email, function(data){
			$scope.auth.notConfirmed = false;
			$scope.auth.email        = '';
			messagesServ.showMessages(data.status, data.msg);
		});
	}

	this.init();
});



rainApp.controller('signupCtrl', function($location, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		$scope.user = {
			email: '',
			password: '',
			agree: false
		};
	}
	$scope.signup = function(){
		if (!$scope.user.email || !$scope.user.password){
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		}
		else if (!/^\S+@\S+$/.test($scope.user.email)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Email" має бути наступного формату: email@email.com!');
		}
		else if (!$scope.user.agree){
			messagesServ.showMessages('error', 'Помилка! Ви повинні прийняти умови користувацької угоди, повірте, це важливо, там не багато читати :)');
		}
		else{
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

	this.init();
});



rainApp.controller('logoutCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		else{
			usersServ.logout(function(data){
				if (data.status == 'success'){
					localStorageService.remove('token');
					$window.location.href = '/';
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}

	this.init();
});



rainApp.controller('confirmCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		let confirm = $routeParams.confirm.split('.');
		usersServ.confirm(confirm, function(data){
			messagesServ.showMessages(data.status, data.msg, 2000, function(){
				if (data.status == 'success'){
					$location.url('home');
				}
			});
		});
	}

	this.init();
});



rainApp.controller('passwordCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		$scope.email = ''
	}
	$scope.resetPassword = function(){
		if (!$scope.email){
			messagesServ.showMessages('error', 'Помилка! Поле "Email" обов\'язкове для заповнення!');
		}
		else{
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



rainApp.controller('resetCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		let reset = $routeParams.password.split('.');
		usersServ.reset(reset, function(data){
			messagesServ.showMessages(data.status, data.msg, false, function(){
				if (data.status == 'success'){
					$location.url('home');
				}
			});
		});
	}

	this.init();
});



rainApp.controller('profileCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.email      = '';
		$scope.chPassword = {
			password: '',
			newPassword: '',
			confirmPassword: ''
		};

		usersServ.getProfile(function(data){
			if (data.status == 'success'){
				$scope.email   = data.arr.email;
				$scope.created = data.arr.created;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.editPassword = function(){
		if (!$scope.chPassword.password || !$scope.chPassword.newPassword || !$scope.chPassword.confirmPassword){
			messagesServ.showMessages('error', 'Помилка! Поля "Актуальний пароль", "Новий пароль" та "Повтор нового паролю" обов\'язкові для заповнення!');
		}
		else if ($scope.chPassword.newPassword != $scope.chPassword.confirmPassword){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Новий пароль" та "Повтор нового паролю" мають бути однаковими!');
		}
		else{
			usersServ.editPassword($scope.chPassword, function(data){
				if (data.status == 'success'){
					$scope.chPassword.password = $scope.chPassword.newPassword = $scope.chPassword.confirmPassword = '';
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.removeAccount = function(){
		if (confirm('Ви дійсно хочете видалити всю інформацію (транзакції, категорії, рахунки, бюджети) а також сам акаунт без можливості відновлення?')){
			usersServ.removeAccount(function(data){
				messagesServ.showMessages(data.status, data.msg, false, function(){
					if (data.status == 'success'){
						localStorageService.remove('token');
						$window.location.href = '/';
					}
				});
			});
		}
	}

	this.init();
});



rainApp.controller('forumCtrl', function($location, $scope, $routeParams, messagesServ, localStorageService, forumServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.categories = {
			public: 'Паблік',
			bug: 'Помилки',
			feature: 'Ідеї',
			thank: 'Подяки',
			question: 'Питання',
			forAdmin: 'Адміну'
		};
		$scope.statuses = {
			created: 'Створено',
			viewed: 'Переглянуто',
			progress: 'У розробці',
			fixed: 'Виправлено',
			cancel: 'Відхилено',
			done: 'Зроблено',
			closed: 'Закрито'
		};
		$scope.post = {
			title: '',
			category: '',
			comment: ''
		};
		$scope.comment     = '';
		$scope.posts       = $scope.comments = [];
		$scope.fid         = $routeParams.post;
		$scope.isAdmin     = false;
		$scope.formIsShown = false;
		angular.element(document).find('#popupEditForm').on('hidden.bs.modal', function(){
			$scope.formIsShown = false;
		});
		if (!$scope.fid){
			forumServ.getPosts($scope.posts.length, 20, function(data){
				if (data.status == 'success'){
					data.arr       = data.arr ? data.arr : [];
					$scope.posts   = data.arr;
					$scope.isAdmin = data.isAdmin;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
		else{
			forumServ.getPost($scope.fid, function(data){
				if (data.status == 'success'){
					$scope.post.id        = data.arr.id;
					$scope.post.title     = data.arr.title;
					$scope.post.category  = data.arr.category;
					$scope.post.status    = data.arr.status;
					$scope.post.created   = data.arr.created;
					$scope.post.updated   = data.arr.updated;
					$scope.post.email     = data.arr.email;
					$scope.post.admin     = data.arr.admin;
					$scope.post.email_upd = data.arr.email_upd;
					$scope.post.admin_upd = data.arr.admin_upd;
					$scope.post.count     = data.arr.count;
					$scope.comments       = data.arr.comments;
					$scope.isAdmin        = data.isAdmin;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.setFormIsShown = function(){
		$scope.formIsShown = true;
	}
	$scope.addPost = function(){
		if (!$scope.post.title || !$scope.post.category || !$scope.post.comment){
			messagesServ.showMessages('error', 'Помилка! Поля "Тема", "Категорія" та "Перший коментар" обов\'язкові для заповнення!');
		}
		else{
			forumServ.addPost($scope.post, function(data){
				if (data.status == 'success'){
					$scope.posts.unshift(data.arr);
					$scope.post.title  = $scope.post.category = $scope.post.comment = '';
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown = false;
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.addComment = function(){
		if (!$scope.comment){
			messagesServ.showMessages('error', 'Помилка! Поле "Коментар" обов\'язкове для заповнення!');
		}
		else{
			$scope.fid = $routeParams.post;
			forumServ.addComment($scope.fid, $scope.comment, function(data){
				if (data.status == 'success'){
					$scope.comments.push(data.arr);
					$scope.post.count     = $scope.comments.length;
					$scope.post.updated   = data.arr.created;
					$scope.post.email_upd = data.arr.email;
					$scope.comment        = '';
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown    = false;
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.setPostStatus = function(id, status){
		forumServ.setPostStatus(id, status, function(data){
			if (data.status == 'success'){
				$scope.post.status = data.arr.status;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
        });
	}

	this.init();
});



rainApp.controller('productsCtrl', function($location, $scope, messagesServ, productsServ, localStorageService){
	this.init = function(){
		$scope.products = [];
		$scope.getProducts();
	}
	$scope.getProducts = function(){
		productsServ.getProducts(function(data){
			if (data.status == 'success'){
				data.arr          = data.arr ? data.arr : [];
				$scope.products = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getProduct = function(id){
		productsServ.getProduct(id, function(data){
			if (data.status == 'success'){
				$scope.category.id    = data.arr.id;
				$scope.category.title = data.arr.title;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}

	this.init();
});
