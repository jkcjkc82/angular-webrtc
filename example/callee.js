function calleeCtrl($scope,socket,userMedia,peerConnection) {
	// init
	$scope.init = function() {
		$scope.signalingComplete = 0;
		$scope.peer2 = new peerConnection;
		$scope.peer2.onaddtream = function(e) {
			console.log("peer2.onaddstream()",e);
			var video = document.querySelector("#v1");
			video.src = URL.createObjectURL(e.stream);	
			video.play();
		};
		$scope.peer2.create();
		$scope.peer2.candidate(function(e) {
			if(!$scope.signalingComplete) return;
			console.log("candidate",$scope.signalingComplete);
			$scope.socket.socket.emit('req', {
				candidate: JSON.stringify(e.candidate)
			});
		});

		$scope.media1 = new userMedia();
		$scope.media1.callback = function(stream) {
			console.log("media1.callback()",stream);
			$scope.peer2.peer.addStream(stream);
		};

		$scope.dc2 = $scope.peer2.peer.createDataChannel("mylabel",{ reliable:false });  // create the receiving RTCDataChannel (reliable mode)				
		$scope.dc2.onmessage = function(data) {
			$scope.message = data.data;
			$scope.$digest();
		};			
	};

	$scope.connect = function() {		
		$scope.socket = new socket();
		$scope.socket.create();

		$scope.socket.peer = $scope.peer2.peer;
		$scope.peer2.socket = $scope.socket.socket;

		$scope.socket.onConnect(function() {
			$scope.isConnect = 1;
			$scope.$digest();
		});
		$scope.socket.onRes(function(type,res) {
			if(type == 1 && $scope.signalingComplete) { // candidate
				console.log("onRes - add candidate",JSON.parse(res.candidate));
				var candidate = new RTCIceCandidate(JSON.parse(res.candidate));
				$scope.peer2.peer.addIceCandidate(candidate);
			} else if(type == 3) { // offer
				var description = typeof RTCSessionDescription != "undefined" ? new RTCSessionDescription(res.description) : res.description;
				$scope.peer2.answer(description,function(description) {
					console.log("3. answer - setLocalDescription",description);
					$scope.peer2.peer.setLocalDescription(description);

					$scope.socket.socket.emit('req', {
						description: description
					});		
					$scope.signalingComplete = 1;		
				});							
			}			
		});
	};

	// 비디오
	$scope.sendVideo = function() {
		$scope.media1.create();
	};	

	$scope.send = function() {
		$scope.dc2.send($scope.message_text);
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

			    console.log(data.message);
			    $scope.dc2.send(JSON.stringify(data.message)); // use JSON.stringify for chrome!		        
		    }
		};
		reader.readAsDataURL(files[0]);
	};		

	$scope.init();
	// $scope.sendVideo();
	// $scope.connect();
}