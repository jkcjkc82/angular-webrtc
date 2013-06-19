angular.module('peer-connection', ['webrtc-module']).config(function() {
});

function PeerConnectionCtrl($scope, peerConnection) {
	$scope.init = function() {
	};

	$scope.create = function() {
		$scope.pc = new peerConnection();

		$scope.pc.create();
	};

	$scope.init();
}