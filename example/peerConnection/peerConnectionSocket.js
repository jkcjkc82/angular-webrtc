angular.module('peer-connection-socket', ['webrtc-module','webrtc-socket-module']).config(function() {
});

function PeerConnectionSocketCtrl($scope, mediastream, peerConnection, WebrtcSocket) {
	$scope.init = function() {
		$scope.sock = WebrtcSocket({
			socket_server: "http://webrtc.kichul.co.kr:3000",
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
				$scope.pc.addIceCandidate(candidate);
			},
		});		

		$scope.v1 = document.querySelector("#v1");
		$scope.v2 = document.querySelector("#v2");

		$scope.pc = peerConnection({
			// servers: {
			// 	iceServers:[{
			// 		url:"stun:kichul.co.kr:3478"						
			// 	}]
			// },			
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
				console.log(e);
				if(!e.candidate) {
					$scope.sock.disconnect();
					return;	
				}
				if(!$scope.pc.isFinishSignaling) return;
				
				$scope.sock.sendCandidate(e.candidate);
			},
			onaddstream: function(e) {
				$scope.v2.src = window.URL.createObjectURL(e.stream);
			}
		});

		$scope.media = mediastream({
			successCallback: function(stream) {
				$scope.v1.src = window.URL.createObjectURL(stream);
				$scope.pc.addStream(stream);
			}
		});

		$scope.media.getUserMedia();
		$scope.pc.create();
		$scope.sock.connect();
	};

	$scope.offer = function() {
		$scope.pc.offer();
	};

	$scope.init();
}
