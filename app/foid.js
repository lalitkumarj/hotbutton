var app = app || angular.module('app',[]);

app.controller("hotbuttonController", ['$scope','$http', 'hotbuttonModel', function($scope, $http, hotbuttonModel){
    $scope.query = {"candidate":"",
		    "issue":"",
		    "text":""}

    $scope.factoid_list = [];
    
    $scope.search_results = [];
    
    $scope.do_search = function(){
	$http.post("/search",JSON.stringify($scope.query)).success(function(data){
	    $scope.search_results = data;
	}).error(function(data){
	    alert("SAAAAAAAAAAAA"+JSON.stringify(data))
	})
    }

    $scope.update_factoids = function(){
	$http.post("/update_factoids",JSON.stringify($scope.factoid_list)).success(function(data){
	    if(data != "success")
		console.log(data);
	}).error(function(data){
	    alert("UAAAAAAAAAAAA"+JSON.stringify(data))
	})
    }
    
    
    $scope.initialise = function(){
	$http.get("/my_factoids").success(function(data){
	    $scope.factoid_list = data;
	})
    }
}]);

app.service("hotbuttonModel", function(){
    this.candidates = [];
    this.issues = [];
    var self = this;
    $http.get("/candidates").success(function(data){
	self.candidates = data;
    }).error(function(data){
	alert("CAAAAAAAAAAAAA"+JSON.stringify(data))
    });
    $http.get("/issues").success(function(data){
	self.issues = data;
    }).error(function(data){
	alert("IAAAAAAAAAAAAA"+JSON.stringify(data))
    });
});
