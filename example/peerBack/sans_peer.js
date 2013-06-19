function sansPeerCtrl($scope,socket,userMedia,peerConnection) {
	// init
	$scope.init = function() {
		$scope.peer1 = new peerConnection;
		$scope.peer1.onaddtream = function(e) {
			console.log("peer1.onaddstream()",e);
			var video = document.querySelector("#v1");
			video.src = URL.createObjectURL(e.stream);	
			video.play();				
		};
		$scope.peer1.create();
		$scope.peer1.peer.onicecandidate = function(e) {
			// console.log("onicecandidate1",e);
			if(!e.candidate) return;
			$scope.peer2.peer.addIceCandidate(new RTCIceCandidate(e.candidate)); 
		};		

		$scope.peer2 = new peerConnection;
		$scope.peer2.onaddtream = function(e) {
			console.log("peer2.onaddstream()",e.stream);
			var video = document.querySelector("#v2");
			video.src = URL.createObjectURL(e.stream);	
			video.play();				
		};		
		$scope.peer2.create();	
		$scope.peer2.peer.onicecandidate = function(e) {
			console.log("onicecandidate2",e);
			if(!e.candidate) return;
			$scope.peer1.peer.addIceCandidate(new RTCIceCandidate(e.candidate)); 
		};			

		$scope.media1 = new userMedia();
		$scope.media1.callback = function(stream) {
			console.log("media1.callback()",stream);
			$scope.peer1.peer.addStream(stream);			
		};

		$scope.media2 = new userMedia();
		$scope.media2.callback = function(stream) {			
			console.log("media2.callback()",stream);
			$scope.peer2.peer.addStream(stream);
		};				
	};

	// offer 처리
	$scope.offer = function() {
		$scope.isCreatedOffer = 1;

		$scope.peer1.peer.createOffer(function(description) {	
			console.log(description);
			$scope.peer1.peer.setLocalDescription(description);
			$scope.peer2.peer.setRemoteDescription(description);

			$scope.peer2.peer.createAnswer(function(description) {
				console.log(description);
				$scope.peer2.peer.setLocalDescription(description);
				$scope.peer1.peer.setRemoteDescription(description);				
			});
		});
	};

	// 비디오
	$scope.sendVideo1 = function() {
		$scope.media1.create();
	};

	// 비디오
	$scope.sendVideo2 = function() {
		$scope.media2.create();
	};	

	$scope.init();
}