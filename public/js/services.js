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
    this.signin = function(user, cb){
        requestServ.sendRequest('post', 'signin', {
            email:    user.email,
            password: user.password
        }, cb);
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
