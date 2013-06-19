function ericssonCtrl($scope,socket,userMedia,peerConnection) {
	// init
	$scope.init = function() {
		setTimeout(function() {
			navigator.webkitGetUserMedia("audio,video" , function(stream) {
				document.getElementsByTagName("video")[0].src = window.webkitURL.createObjectURL(stream);
			});		
			var pc = new PeerConnection();	
		},2000);
	};

	$scope.init();
}