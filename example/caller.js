function callerCtrl($scope,socket,userMedia,peerConnection) {
	// init
	$scope.init = function() {
		$scope.signalingComplete = 0;
		$scope.peer1 = new peerConnection;
		$scope.peer1.onaddtream = function(e) {
			var video = document.querySelector("#v1");
			video.src = URL.createObjectURL(e.stream);	
			video.play();				
		};
		$scope.peer1.create();
		$scope.peer1.candidate(function(e) {
			$scope.socket.socket.emit('req', {
				candidate: JSON.stringify(e.candidate)
			});
		});	

		$scope.media1 = new userMedia();
		$scope.media1.callback = function(stream) {
			$scope.peer1.peer.addStream(stream);			
		};
		// typeof webkitRTCPeerConnection != "undefined"
		$scope.dc1 = $scope.peer1.peer.createDataChannel("mylabel",{ reliable:false });  // create the sending RTCDataChannel (reliable mode)
		$scope.dc1.onmessage = function(data) {
			$scope.img = "";
			$scope.message = "";
				console.log(JSON.parse(data.data),data);
			if(data.data.match(/^data/)) {
				$scope.img = data.data;
			} else {
				$scope.message = data.data;	
			}
			

			$scope.$digest();
		};		
	};


	$scope.connect = function() {		
		$scope.socket = new socket();
		$scope.socket.create();

		$scope.socket.peer = $scope.peer1.peer;

		$scope.socket.onConnect(function() {
			$scope.isConnect = 1;
			$scope.$digest();
		});
		$scope.socket.onRes(function(type,res) {
			if(type == 1 && $scope.signalingComplete) { // candidate
				console.log("onRes - add candidate",JSON.parse(res.candidate));
				var candidate = new RTCIceCandidate(JSON.parse(res.candidate));
				$scope.peer1.peer.addIceCandidate(candidate);
			} else if(type == 2) { // answer
				var discription = typeof RTCSessionDescription != "undefined" ? new RTCSessionDescription(res.description) : new mozRTCSessionDescription(res.description);
				console.log("4. onRes - setRemoteDescription",discription);
				$scope.peer1.peer.setRemoteDescription(discription);				
				$scope.signalingComplete = 1;
			}
		});
	};

	// offer 처리
	$scope.offer = function() {
		$scope.peer1.offer(function(description) {
			$scope.isCreatedOffer = 1;
			$scope.$digest();						

			$scope.socket.socket.emit('req', {
				description: description
			});
		});
	};

	// 비디오
	$scope.sendVideo = function() {
		$scope.media1.create();
	};

	$scope.send = function() {
		console.log("send");
		$scope.dc1.send($scope.message_text);
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
		    console.log(data.message);
		    $scope.dc1.send(JSON.stringify(data.message)); // use JSON.stringify for chrome!
		};
		reader.readAsDataURL(files[0]);
	};				


	$scope.init();
	// $scope.sendVideo();
	// $scope.connect();
}