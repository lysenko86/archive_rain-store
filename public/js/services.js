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



rainApp.service('printServ', function($rootScope){
    $rootScope.printMode = false;
    this.togglePrintMode = function(){
		$rootScope.printMode = !$rootScope.printMode;
	}
});



rainApp.service('usersServ', function(requestServ){
    this.getCount = function(cb){
        requestServ.sendRequest('get', 'getCountUsers', {}, cb);
    }
    this.signin = function(user, cb){
        requestServ.sendRequest('post', 'signin', {
            email:    user.email,
            password: user.password
        }, cb);
    }
    this.signup = function(user, cb){
        requestServ.sendRequest('post', 'signup', {
            email:    user.email,
            password: user.password,
            agree:    user.agree
        }, cb);
    }
    this.logout = function(cb){
        requestServ.sendRequest('get', 'logout', {}, cb);
    }
    this.confirm = function(confirm, cb){
        requestServ.sendRequest('get', 'confirmEmail', {
            confirm: confirm[0]+'.'+confirm[1]
        }, cb);
    }
    this.reset = function(reset, cb){
        requestServ.sendRequest('get', 'resetPassword', {
            reset: reset[0]+'.'+reset[1]
        }, cb);
    }
    this.sendConfirmMail = function(email, cb){
        requestServ.sendRequest('post', 'sendConfirmMail', {
            email: email
        }, cb);
    }
    this.sendPasswordMail = function(email, cb){
        requestServ.sendRequest('post', 'sendPasswordMail', {
            email: email
        }, cb);
    }
    this.getProfile = function(cb){
        requestServ.sendRequest('get', 'getProfile', {}, cb);
    }
    this.editPassword = function(chPassword, cb){
        requestServ.sendRequest('post', 'editPassword', {
            password:        chPassword.password,
            newPassword:     chPassword.newPassword,
            confirmPassword: chPassword.confirmPassword
        }, cb);
    }
    this.removeAccount = function(cb){
        requestServ.sendRequest('post', 'removeAccount', {}, cb);
    }
});



rainApp.service('forumServ', function(requestServ){
    this.getPosts = function(from, count, cb){
        requestServ.sendRequest('get', 'getPosts', {
            from:  from,
            count: count
        }, cb);
    }
    this.getPost = function(id, cb){
        requestServ.sendRequest('get', 'getPost', {
            id: id
        }, cb);
    }
    this.addPost = function(post, cb){
        requestServ.sendRequest('post', 'addPost', {
            title:    post.title,
			category: post.category,
			comment:  post.comment
        }, cb);
	}
    this.addComment = function(fid, comment, cb){
        requestServ.sendRequest('post', 'addComment', {
            fid:     fid,
			comment: comment
        }, cb);
	}
    this.setPostStatus = function(id, status, cb){
        requestServ.sendRequest('post', 'setPostStatus', {
            id:     id,
			status: status
        }, cb);
	}
});



rainApp.service('actionsServ', function(requestServ){
    this.getActions = function(filter, cb){
        requestServ.sendRequest('get', 'getActions', {
            start:        filter.start,
            timeInterval: filter.timeInterval,
            searchBy:     filter.searchBy,
            searchText:   filter.searchText
        }, cb);
    }
    this.getAction = function(id, cb){
        requestServ.sendRequest('get', 'getAction', {
            id: id
        }, cb);
    }
    this.editAction = function(action, cb){
        requestServ.sendRequest('post', 'editAction', {
            id:             action.id,
			date:           action.date,
			type:           action.type,
			accountFrom_id: action.accountFrom_id,
			accountTo_id:   action.accountTo_id,
			category_id:    action.category_id,
			sum:            action.sum,
			description:    action.description
        }, cb);
	}
    this.delAction = function(id, cb){
        requestServ.sendRequest('post', 'delAction', {
			id: id
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
