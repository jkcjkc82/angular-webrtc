angular.module('peer-connection', ['webrtc-module']).config(function() {
});

function PeerConnectionCtrl($scope, mediastream, peerConnection) {
	$scope.init = function() {
		$scope.v1 = document.querySelector("#v1");
		$scope.v2 = document.querySelector("#v2");

		$scope.pc1 = peerConnection({
			offerCallback: function(description) {
				$scope.pc1.setLocalDescription(description);
				$scope.pc2.setRemoteDescription(description);
				
				$scope.pc2.answer();
			},
			onicecandidate: function(e) {
				if(!e.candidate) return;	
				if(!$scope.pc1.isFinishSignaling) return;			
		
				$scope.pc2.addIceCandidate(e.candidate);
			},
			onaddstream: function(e) {
				console.log("onaddstream");
				$scope.v1.src = window.URL.createObjectURL(e.stream);
			}
		});

		$scope.pc2 = peerConnection({
			answerCallback: function(description) {
				$scope.pc2.setLocalDescription(description);
				$scope.pc1.setRemoteDescription(description);

				$scope.pc1.finishSignaling();
				$scope.pc2.finishSignaling();
			},
			onicecandidate: function(e) {
				if(!e.candidate) return;
				if(!$scope.pc2.isFinishSignaling) return;

				$scope.pc1.addIceCandidate(e.candidate);
			},
			onaddstream: function(e) {
				console.log("onaddstream");
				$scope.v2.src = window.URL.createObjectURL(e.stream);
			}
		});		

		$scope.m1 = mediastream({
			successCallback: function(stream) {
				$scope.pc2.addStream(stream);
			}
		});		

		$scope.m2 = mediastream({
			successCallback: function(stream) {
				$scope.pc1.addStream(stream);
			}
		});						

		$scope.m1.getUserMedia();
		$scope.m2.getUserMedia();

		$scope.pc1.create();
		$scope.pc2.create();	
	};

	$scope.offer = function() {
		$scope.pc1.offer();
	};

	$scope.init();
}