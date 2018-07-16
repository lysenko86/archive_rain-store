"use strict";

var rainApp = angular.module('rainApp', ['ngRoute', 'LocalStorageModule']);

rainApp.config(function($routeProvider, localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('RainStore');

	$routeProvider
	.when('/home', {
		templateUrl: 'public/templates/home.html',
		controller: 'homeCtrl'
	})
    .when('/signin', {
		templateUrl: 'templates/signin.html',
		controller: 'signinCtrl'
	})
    .when('/signup', {
		templateUrl: 'templates/signup.html',
		controller: 'signupCtrl'
	})
    .when('/agree', {
		templateUrl: 'templates/agree.html'
	})
    .when('/help', {
		templateUrl: 'templates/help.html'
	})
    .when('/confirm/:confirm', {
		templateUrl: 'templates/confirm.html',
		controller: 'confirmCtrl'
	})
    .when('/password', {
		templateUrl: 'templates/password.html',
		controller: 'passwordCtrl'
	})
    .when('/reset/:password', {
		templateUrl: 'templates/reset.html',
		controller: 'resetCtrl'
	})
    .when('/profile', {
		templateUrl: 'templates/profile.html',
		controller: 'profileCtrl'
	})
	.when('/categories', {
		templateUrl: 'templates/categories.html',
		controller: 'categoriesCtrl'
	})
    .when('/logout', {
		templateUrl: 'templates/logout.html',
		controller: 'logoutCtrl'
	})
	.otherwise({
		redirectTo: '/home'
	});
});
