'use strict';

angular.module('myApp.board', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/board', {
	    templateUrl: 'board/board.html',
	    controller: 'BoardCtrl',
	    controllerAs: 'board'
	});
    }])
    .controller('BoardCtrl', ['$http', function($http) {
	var self = this;
	$http.get('/posts').success(function(data){self.posts = data["posts"]});
    }]);
