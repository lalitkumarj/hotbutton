angular.module('HotButtonApp').controller('BoardController', ['$scope', '$uibModal', 'addPostModal', '$http', function($scope, $uibModal, addPostModal, $http) {
    // Get the user
    $scope.getUser = function(){
	$http({
	    method: 'POST',
	    url: '/get_user'
	}).then(function successCallback(response){
	    console.log('got user', response);
	    $scope.user = response.data;

	    if($scope.user.posts){
		$scope.posts = $scope.user.posts;
	    } else{
		$scope.posts = {}
	    }
	    
	});
    };
    // Get candidates
    $scope.getCandidates = function(){
	$http({
	    method: 'POST',
	    url: '/get_candidates'
	}).then(function successCallback(response){
	    console.log('got user', response);
	    $scope.full_candidates = response.data;
	});
    };
    
    $scope.getPosts = function(){
	$http({
	    method: 'POST',
	    url: '/get_posts',
	}).then(function successCallback(response) {
	    if(response.data.posts){
		$scope.posts = response.data.posts;
	    } else{
		$scope.posts = {}
	    }
	}, function errorCallback(response) {
	    console.log("get post failure");
	});
    }

    $scope.savePosts = function(){
	$http({
	    method: 'POST',
	    url: '/save_posts',
	    data: {posts: $scope.posts}
	}).then(function successCallback(response) {
	    console.log($scope.posts);
	    console.log("save post success");
	}, function errorCallback(response) {
	    console.log("post failure");
	});
    }

    $scope.addCandidate = function (name) {
	if(!(name in $scope.posts)){
	    $scope.posts[name]=[];
	}
	$scope.savePosts();
    };


    $scope.addPost = function(post){
	if(!(post.candidate in $scope.posts)){
	    $scope.posts[post.candidate] = [];
	    $scope.posts[post.candidate].push(post);
	}
	var posts = $scope.posts[post.candidate];
	console.log("cand posts", posts);
	for(var i=0; i < posts.length; i++){
	    if(posts[i]._id == post._id){
		posts[i] = post;
		return;
	    }
	}
	$scope.posts[post.candidate].push(post);
	$scope.savePosts();
    } 	

    $scope.getUser();
    $scope.getCandidates();
    $scope.feed_posts = feed_posts;

    
    $scope.openAddCandidateModal = function () {
	var modalInstance = $uibModal.open({
	    animation: true,
	    templateUrl: 'AddCandidateModal.html',
	    controller: 'AddCandidateModalInstanceCtrl',
	    bindToControlle:true,
	    scope:$scope
	});
    };
    
    $scope.openAddPostModal = function () {
	var modalInstance = addPostModal;
	modalInstance.open({
	    scope: $scope,
	    mode: 'new'
	});
    };

    $scope.feedSortableOptions = {
	connectWith: '.cand_post_list',
	update: function(ev, ui) {
	    var originNgModel = ui.item.sortable.sourceModel;
	    var targetNgModel = ui.item.sortable.droptargetModel;
	    var itemModel = originNgModel[ui.item.sortable.index];
	    for(var k in $scope.posts){
		console.log(k)
		    if(targetNgModel == $scope.posts[k]){
			var candidate  = k;
		    }
	    }
	    itemModel.parent = itemModel._id;
	    itemModel._id = make_id();
	    if(!(candidate === itemModel.candidate)){
		ui.item.sortable.cancel(); 
	    }
	    $scope.savePosts();
	}
    }    
}]);


angular.module('HotButtonApp').factory('addPostModal', ['$uibModal', function($uibModal) {
    var modal = {};
    modal.open = function(params){
	var modalInstance = $uibModal.open({
	    animation: true,
	    templateUrl: 'AddPostModal.html',
	    controller: 'AddPostModalInstanceCtrl',
	    bindToControlle:true,
	    scope: params.scope});
	modalInstance.post = params.post || {};
	modalInstance.mode = params.mode || 'new';
    };
    return modal;
}]);

angular.module('HotButtonApp').directive('board', function($uibModal, addPostModal){
    return{
	restrict: 'E',
	scope: true,
	templateUrl: 'partials/board_template.html',
	link: function(scope, element, attrs) {
	    scope.addPostCandidate = function(candidate){
		var modalInstance = addPostModal;
		modalInstance.open({
		    scope: scope,
		    mode: 'new',
		    post: {'candidate': candidate}
		});
	    }
	    scope.sortableOptions = {
		//recieve: function(e, ui) { console.log(ui.item.toString()) },
		axis: 'y'
	    };

	}
    };
});

angular.module('HotButtonApp').directive('candidate', function() {
    return{
	restrict: 'E',
	scope: {
	    data: '='
	},
	templateUrl: 'partials/candidate_template.html',
	link: function(scope, element, attrs) {
	    scope.candidate = scope.data
	}
    };
});

angular.module('HotButtonApp').directive('post', function() {
    return{
	restrict: 'E',
	scope:{
	    data: '='
	},
	templateUrl: 'partials/post_template.html',
	link: function(scope, element, attrs) {
	    scope.post = scope.data
	}
    };
});

angular.module('HotButtonApp').directive('postEditor', function() {
    return{
	restrict: 'E',
	scope: {
	    mode: '=',
	    post: '=',
	    add_post: '&addPost',
	    callback: '&callback'
	},
	templateUrl: 'partials/post_editor_template.html',
	link: function(scope, element, attrs) {
	    console.log('post and mode', scope.post, scope.mode);
	    if((!scope.post && (scope.mode == 'edit'|| scope.mode=='clone')) || !scope.mode){
		scope.mode == scope.mode||'new';
	    }
	    scope.n_post = scope.post||{};		
	    if(scope.mode == 'edit'){
		scope.n_post._id = scope.post._id;
		scope.n_post.parent = scope.post.parent;
	    } else if(scope.mode == 'clone'){
		scope.n_post._id = make_id();
		scope.n_post.parent = scope.post._id;
	    } else if(scope.mode == 'new'){
		scope.n_post._id = make_id();
		scope.n_post.parent = null;
	    }
	    scope.save_post = function(){
		scope.add_post({'n_post':scope.n_post});
		scope.callback({'n_post':scope.n_post});
	    }
	}
    };
});

/* $scope.makePostsDict = function(posts){
   if(posts.length == 0){
   $scope.posts = {};
   } else {
   for(var post in posts){
   if(post.candidate in $scope.posts){
   $scope.posts[post.candidate].push(posts[post]);
   } else{
   $scope.posts[post.candidate] = [];
   $scope.posts[post.candidate].push(posts[post]);
   }
   }
   }
   };

   $scope.makePostsArray = function(){
   var posts = []; 
   for(var candidate in posts){
   for(var i=0; i < $scope.posts[candidate].length;i++){
   posts.push($scope.posts[candidate][i]);
   }
   }
   return posts;
   }; */
