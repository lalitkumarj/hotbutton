angular.module('HotButtonApp').controller('AddPostModalInstanceCtrl', function ($scope, $uibModalInstance) {
    $scope.post = $uibModalInstance.post;
    $scope.mode = $uibModalInstance.mode;
    $scope.ok = function () {
	$uibModalInstance.close();
    };
});
