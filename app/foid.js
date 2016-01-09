var app = app || angular.module('app',[]);

app.controller("hotbuttonController", ['$scope','$http', 'hotbuttonModel', function($scope, $http, hotbuttonModel){
    $scope.query = {"candidate":"",
		    "issue":"",
		    "text":""}

    $scope.search_results = [];
    
    $scope.do_search = function(){
	$http.post("/search",JSON.stringify($scope.query)).success(function(data){
	    $scope.search_results = data;
	}).error(function(data){
	    alert("AAAAAAAAAAAA"+JSON.stringify(data))
	})
    }
}]);

app.service("hotbuttonModel", function(){

});
