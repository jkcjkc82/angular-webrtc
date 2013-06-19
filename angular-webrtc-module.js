angular.module('webrtc-module', []).
factory('peerConnection', function() {	
	var default_parameter = {
		onicecandidate: function(e) {},
		onaddstream: function(e) {},
		onremovestream: function(e) {},
		ondatachannel: function(e) {},
		onconnection: function(e) {},
		offerCallback: function(description) {},
		answerCallback: function(description) {},
		servers: {
			iceServers:[{
				url:"stun:stun.l.google111.com:19302"						
			}]
		},
		configuration: {
			optional: [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }]
		}
	};

	return function(parameter) {
		parameter = angular.extend(angular.extend({}, default_parameter), parameter);

		return {
			peer: null,
			isFinishSignaling: 0,
			create: function() {
				var PeerConnection = typeof webkitRTCPeerConnection != "undefined" ? webkitRTCPeerConnection : mozRTCPeerConnection;				
				this.peer = new PeerConnection(parameter.servers, parameter.configuration);

				this.peer.onaddstream = parameter.onaddstream;
				this.peer.onremovestream = parameter.onremovestream;
				this.peer.ondatachannel = parameter.ondatachannel;
				this.peer.onconnection = parameter.onconnection;
				this.peer.onicecandidate = parameter.onicecandidate;
			},
			offer: function(callback) {
				this.peer.createOffer(function(description) {
					parameter.offerCallback(description);
				});
			},
			answer: function(description) {
				this.peer.createAnswer(parameter.answerCallback);
			},
			setLocalDescription: function(description) {
				this.peer.setLocalDescription(description);
			},
			setRemoteDescription: function(description) {
				this.peer.setRemoteDescription(description);
			},
			addIceCandidate: function(candidate) {
				this.peer.addIceCandidate(candidate);
			},
			addStream: function(stream) {
				this.peer.addStream(stream);
			},
			finishSignaling: function() {
				this.isFinishSignaling = 1;
			}
		}
	}	
}).factory('mediastream', function() {
	var default_parameter = {
		constraints: {
			"audio": false, 
			"video": true
		},
		successCallback: function(stream) {},
		errorCallback: function(error) {}
	};

	return function(parameter) {
		parameter = angular.extend(angular.extend({}, default_parameter), parameter);

		return {
			getUserMedia: function() {
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				navigator.getUserMedia(parameter.constraints, parameter.successCallback, parameter.errorCallback);
			}
		};
	};
});


