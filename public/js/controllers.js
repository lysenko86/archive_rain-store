"use strict";



rainApp.controller('menuCtrl', function($location, $scope){
	this.init = function(){
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
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getProduct = function(id){
		$location.url('product/' + id);
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
