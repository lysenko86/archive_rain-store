"use strict";

var isDev  = location.href.indexOf('/rain/') > -1;
var config = {
    isDev : isDev,
    api: isDev ? 'http://rain/api.php' : 'http://rainstore.com.ua/api.php'
};



rainApp.service('messagesServ', function($rootScope, $timeout){
    $rootScope.messages = [];
    this.showMessages = function(status, text, delay, cb){
        $rootScope.messages.push({
            status: status,
            class:  status == 'error' ? 'alert-danger' : 'alert-success',
            text:   text
        });
        $timeout(function(){
            $rootScope.messages.shift();
            if (cb){
                cb();
            }
        }, delay ? delay : 4000);
    }
});



rainApp.service('requestServ', function($http, localStorageService, messagesServ){
    var token = localStorageService.get('token');
    var link  = this;
    this.sendRequest = function(method, action, data, cb){
        angular.element(document).find('#loaderPage').css('display', 'flex');
        let url = config.api + '?token=' + token;
        if (method === 'get'){
            url += '&action=' + action;
            for (let key in data){
                url += '&'+key+'=' + data[key];
                delete data[key];
            }
            $http.get(url)
                .success(function(data){
                    link.getResponse(data, cb);
                })
                .error(function(error, status){
                    link.getResponse('requestError', cb);
                });
        }
        else if (method === 'post'){
            data.action = action;
            $http.post(url, data)
                 .success(function(data){
                     link.getResponse(data, cb);
                 })
                 .error(function(error, status){
                     link.getResponse('requestError', cb);
                 });
        }
        else{
            link.getResponse('requestError', cb);
        }
    }
    this.getResponse = function(data, cb){
        angular.element(document).find('#loaderPage').css('display', 'none');
        if (data == 'requestError'){
            messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
        }
        else{
            cb(data);
        }
    }
});



rainApp.service('usersServ', function(requestServ){
    this.signup = function(user, cb){
        requestServ.sendRequest('post', 'signup', {
            email:    user.email,
            password: user.password,
            agree:    user.agree
        }, cb);
    }
    this.confirm = function(confirm, cb){
        requestServ.sendRequest('get', 'confirm', {
            confirm: confirm
        }, cb);
    }
    this.sendConfirmMail = function(email, cb){
        requestServ.sendRequest('post', 'sendConfirmMail', {
            email: email
        }, cb);
    }
    this.signin = function(user, cb){
        requestServ.sendRequest('post', 'signin', {
            email:    user.email,
            password: user.password
        }, cb);
    }
    this.sendPasswordMail = function(email, cb){
        requestServ.sendRequest('post', 'sendPasswordMail', {
            email: email
        }, cb);
    }
    this.reset = function(reset, cb){
        requestServ.sendRequest('get', 'reset', {
            reset: reset
        }, cb);
    }
    this.logout = function(cb){
        requestServ.sendRequest('get', 'logout', {}, cb);
    }
    this.getProfile = function(cb){
        requestServ.sendRequest('get', 'getProfile', {}, cb);
    }
});



rainApp.service('productsServ', function(requestServ){
    this.getProducts = function(cb){
        requestServ.sendRequest('get', 'getProducts', {}, cb);
    }

    this.getProduct = function(id, cb){
        requestServ.sendRequest('get', 'getProduct', {
            id: id
        }, cb);
    }
});



rainApp.service('cartServ', function(){
    this.refreshCart = function(cart){
        let sum = 0;
		let newProducts = [];
		let ids = [];
		cart.products.map(item => {
			if (ids.indexOf(item.id) > -1){
				return false;
			}
			cart.products.map(subItem => {
				if (item.id == subItem.id){
					let index = -1;
					for (let i=0; i<newProducts.length; i++){
						if (newProducts[i].id == item.id){
							index = i;
						}
					}
					if (index < 0){
						newProducts.push(item);
						sum += Math.round(item.price * item.count);
					} else {
						newProducts[index].count += subItem.count;
						sum += Math.round(subItem.price * subItem.count);
					}
				}
			});
			ids.push(item.id);
		});
        return {
            uid: cart.uid,
            products: newProducts,
            sum: sum
        }
    }
    this.getIndexOfUserCart = function(arr, uid){
        let index = -1;
        for (let i=0; i<arr.length; i++){
            if (arr[i].uid == uid){
                index = i;
                break;
            }
        }
        return index;
    }
});
