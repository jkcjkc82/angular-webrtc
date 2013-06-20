angular.module('dataChannelApp', ['webrtc-module','webrtc-socket-module']).config(function() {
});

function DataChannelCtrl($scope, WebrtcSocket, peerConnection, dataChannel) {
	$scope.init = function() {
		$scope.sock = WebrtcSocket({
			onConnect: function() {
				$scope.sock.joinRoom();		
			},
			receiveSDPCallback: function(description) {
				$scope.pc.setRemoteDescription(description);
				$scope.pc.answer(description);
			},
			receiveReturnSDPCallback: function(description) {
				$scope.pc.setRemoteDescription(description);
				$scope.pc.finishSignaling();				
			},
			receiveCandidateallback: function(candidate) {
				$scope.pc.addIceCandidate(candidate)
			},
		});	

		$scope.pc = peerConnection({
			offerCallback: function(description) {
				$scope.pc.setLocalDescription(description);

				$scope.sock.sendSDP(description);
			},
			answerCallback: function(description) {
				$scope.pc.setLocalDescription(description);
				$scope.pc.finishSignaling();

				$scope.sock.returnSDP(description);
			},
			onicecandidate: function(e) {
				if(!e.candidate) {
					$scope.sock.disconnect();					
					return;	
				}
				if(!$scope.pc.isFinishSignaling) return;
				
				$scope.sock.sendCandidate(e.candidate);
			}
		});

		$scope.dc = dataChannel({
			peer_connection: $scope.pc,
			onmessage: function(e) {
				console.log(e.data);
			}
		});	

		$scope.pc.create();		
		$scope.dc.create();
		$scope.sock.connect();					
	};

	$scope.offer = function() {
		$scope.pc.offer();
	};

	$scope.send = function() {
		$scope.dc.send("hello world");
	};

	$scope.init();
}