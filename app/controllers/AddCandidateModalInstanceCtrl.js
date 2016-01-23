angular.module('HotButtonApp').controller('AddCandidateModalInstanceCtrl', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
	$uibModalInstance.close();
    };
});

