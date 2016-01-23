angular.module('HotButtonApp')
    .controller('LoginController', function($scope, $location, $auth) {
	$scope.authenticate = function(provider) {
            $auth.authenticate(provider)
		.then(function() {
		    console.log('You have successfully signed in with ' + provider + '!');
		    $location.path('/board');
		})
		.catch(function(error) {
		    if (error.error) {
			console.log(error.error);
		    } else if (error.data) {
			console.log(error.data.message, error.status);
		    } else {
			console.log(error);
		    }
		});
	};
    });
