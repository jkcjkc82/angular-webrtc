angular.module('peer-connection', ['webrtc-module']).config(function() {
});

function PeerConnectionCtrl($scope, peerConnection) {
	$scope.init = function() {
	};

	$scope.create = function() {
		$scope.pc1 = new peerConnection();

		$scope.pc1.create();
	};

	$scope.init();
}