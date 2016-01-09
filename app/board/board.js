'use strict';

angular.module('myApp.board', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/board', {
	    templateUrl: 'board/board.html',
	    controller: 'BoardCtrl',
	    controllerAs: 'board'
	});
    }])

    .controller('BoardCtrl', [function() {
	this.posts = board1["posts"];
	console.log()
    }]);
