angular.module('HotButtonApp', ['ui.bootstrap', 'ui.sortable', 'ui.router', 'satellizer'])
    .config(function($stateProvider, $urlRouterProvider, $authProvider) {
	$stateProvider
	    .state('board', {
		url: '/board',
		controller: 'BoardController',
		templateUrl: 'partials/board_page.html',
		resolve: {
		    loginRequired: loginRequired
		}
	    })
	    .state('login', {
		url: '/login',
		controller: 'LoginController',
		templateUrl: 'partials/login.html',
		resolve: {
		    skipIfLoggedIn: skipIfLoggedIn
		}	
	    })
	    .state('logout', {
		url: '/logout',
		controller: 'LogoutController',
		templateUrl: null
	    })

	$urlRouterProvider.otherwise('/');

	$authProvider.google({
	    clientId: '190914374035-b6mr9s41uj953jvimd25t20dcu5iouni.apps.googleusercontent.com',
	});


	function skipIfLoggedIn($q, $auth) {
	    var deferred = $q.defer();
	    if ($auth.isAuthenticated()) {
		deferred.reject();
	    } else {
		deferred.resolve();
	    }
	    return deferred.promise;
	}

	function loginRequired($q, $location, $auth) {
	    var deferred = $q.defer();
	    if ($auth.isAuthenticated()) {
		deferred.resolve();
	    } else {
		$location.path('/login');
	    }
	    return deferred.promise;
	}
	
    });
	    
