"use strict";

var rainApp = angular.module('rainApp', ['ngRoute', 'LocalStorageModule']);

rainApp.config(function($routeProvider, localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('RainStore');

	$routeProvider
	.when('/home', {
		templateUrl: 'public/templates/home.html',
		controller: 'homeCtrl'
	})
    .when('/products', {
		templateUrl: 'public/templates/products.html',
		controller: 'productsCtrl'
	})
    .when('/product/:id', {
		templateUrl: 'public/templates/product.html',
		controller: 'productsCtrl'
	})
	.otherwise({
		redirectTo: '/home'
	});
});
