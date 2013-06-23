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

	$scope.take = function() {
    	var photo = document.getElementsByTagName('canvas')[0];
        var context = photo.getContext('2d');
 
	    photo.width = $scope.video.clientWidth;
	    photo.height = $scope.video.clientHeight;
	 
	    context.drawImage($scope.video, 0, 0, photo.width, photo.height);		
	};

	$scope.init();
}