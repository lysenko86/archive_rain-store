"use strict";

var rainApp = angular.module('rainApp', ['ngRoute', 'LocalStorageModule']);

rainApp.config(function($routeProvider, localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('RainStore');

	$routeProvider
	.when('/home', {
		templateUrl: 'public/templates/home.html',
		controller: 'homeCtrl'
	})
    .when('/agree', {
		templateUrl: 'public/templates/agree.html',
        controller: 'usersCtrl'
	})
    .when('/signup', {
		templateUrl: 'public/templates/signup.html',
		controller: 'usersCtrl'
	})
    .when('/confirm/:confirm', {
		templateUrl: 'public/templates/confirm.html',
		controller: 'usersCtrl'
	})
    .when('/signin', {
		templateUrl: 'public/templates/signin.html',
		controller: 'usersCtrl'
	})
    .when('/password', {
        templateUrl: 'public/templates/password.html',
        controller: 'usersCtrl'
    })
    .when('/reset/:reset', {
		templateUrl: 'public/templates/reset.html',
		controller: 'usersCtrl'
	})
    .when('/logout', {
		templateUrl: 'public/templates/logout.html',
		controller: 'usersCtrl'
	})
    .when('/profile', {
		templateUrl: 'public/templates/profile.html',
		controller: 'usersCtrl'
	})
    .when('/products', {
		templateUrl: 'public/templates/products.html',
		controller: 'productsCtrl'
	})
    .when('/product/:id', {
		templateUrl: 'public/templates/product.html',
		controller: 'productsCtrl'
	})
    .when('/cart', {
		templateUrl: 'public/templates/cart.html',
		controller: 'cartsCtrl'
	})
	.otherwise({
		redirectTo: '/home'
	});
});
