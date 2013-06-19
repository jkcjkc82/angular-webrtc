angular.module('mediastream', ['webrtc-module']).config(function() {
});

function MediaStreamCtrl($scope, mediastream) {
	$scope.isPlay = false;

	$scope.init = function() {
		$scope.video = document.querySelector("video");

		$scope.media = new mediastream({
			successCallback: function(stream) {				
				$scope.video.src = window.URL.createObjectURL(stream);
				
				$scope.play();
				$scope.$digest();
			}
		});

		$scope.media.getUserMedia();
	};

	$scope.play = function() {
		$scope.video.play();

		$scope.isPlay = true;		
	};

	$scope.pause = function() {
		$scope.video.pause();

		$scope.isPlay = false;
	};

	$scope.init();
}