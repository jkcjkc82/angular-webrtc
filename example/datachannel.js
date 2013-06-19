function dataChannelCtrl($scope,socket,userMedia,peerConnection) {
	// init
	$scope.init = function() {
		$scope.peer1 = new peerConnection;
		$scope.peer1.create();
		$scope.peer1.peer.onicecandidate = function(e) {
			// console.log("onicecandidate1",e);
			if(!e.candidate) return;
			$scope.peer2.peer.addIceCandidate(new RTCIceCandidate(e.candidate)); 
		};	
		

		$scope.peer2 = new peerConnection;
		$scope.peer2.create();	
		$scope.peer2.peer.onicecandidate = function(e) {
			// console.log("onicecandidate2",e);
			if(!e.candidate) return;
			$scope.peer1.peer.addIceCandidate(new RTCIceCandidate(e.candidate)); 
		};

		$scope.dc1 = $scope.peer1.peer.createDataChannel("mylabel",{ reliable:false });  // create the sending RTCDataChannel (reliable mode)
		$scope.dc2 = $scope.peer2.peer.createDataChannel("mylabel",{ reliable:false });  // create the receiving RTCDataChannel (reliable mode)				
		// $scope.dc1.binaryType = "arrayBuffer";
		// $scope.dc2.binaryType = "arrayBuffer";

		$scope.dc1.onmessage = function(data) {
			console.log(data.data);
		};
		$scope.dc2.onmessage = function(data) {
			console.log(data.data);
		};						
	};

	// offer 처리
	$scope.offer = function() {
		$scope.isCreatedOffer = 1;

		$scope.peer1.peer.createOffer(function(description) {	
			$scope.peer1.peer.setLocalDescription(description);
			$scope.peer2.peer.setRemoteDescription(description);

			$scope.peer2.peer.createAnswer(function(description) {
				$scope.peer2.peer.setLocalDescription(description);
				$scope.peer1.peer.setRemoteDescription(description);								
			});
		});
	};

	$scope.send1 = function() {
		$scope.dc1.send("hello 1");
	};

	$scope.send2 = function() {
		$scope.dc2.send("hello 2");
	};	

	$scope.changeFile = function(file) {
		var files = document.getElementById('files').files;
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			var chunkLength = 1000;
		    var data = {}; // data object to transmit over data channel

		    if (event) text = event.target.result; // on first invocation

		    if (text.length > chunkLength) {
		        data.message = text.slice(0, chunkLength); // getting chunk using predefined chunk length
		    } else {
		        data.message = text;
		        data.last = true;
		    }
		    $scope.dc1.send(data.message); // use JSON.stringify for chrome!

		    // var remainingDataURL = text.slice(data.message.length);
		    // if (remainingDataURL.length) setTimeout(function () {
		    //     onReadAsDataURL(null, remainingDataURL); // continue transmitting
		    // }, 500)
		};
		reader.readAsDataURL(files[0]);
	};

	$scope.init();
}