/**
 * @doc module
 * @name webrt_init
 * @description WEBRTC 초기화
 * 
 * 
 */
function WEBRTC_INIT() {
	window.getUserMedia = null;
	window.PeerConnection = null;

	if(!window.URL ) window.URL={};
	if(!window.URL.createObjectURL) {
		window.URL.createObjectURL= function(obj) {
			return obj;
		}
	}

	if(navigator.mozGetUserMedia) {
		window.getUserMedia = navigator.mozGetUserMedia.bind(navigator);
		window.PeerConnection = mozRTCPeerConnection;
	} else if(navigator.webkitGetUserMedia) {
		window.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
		window.PeerConnection = webkitRTCPeerConnection;
	}	
}
WEBRTC_INIT();

angular.module('webrtc-module', []).
factory('peerConnection', function() {
	var default_parameter = {
		onicecandidate: function(e) {},
		onaddstream: function(e) {},
		onremovestream: function(e) {},
		ondatachannel: function(e) {},
		onconnection: function(e) {},
		offerCallback: function() {},
		offerErrorCallback: function() {},
		answerCallback: function(description) {},
		answerErrorCallback: function() {},
		servers: {
			iceServers:[{
				url:"stun:stun.l.google111.com:19302"						
			}]
		},
		configuration: {
			optional: [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }]
		},
		sdp_opt: { 
			'mandatory': {
				'OfferToReceiveAudio': true, 
				'OfferToReceiveVideo': true
			}
		}
	};

	return function(parameter) {
		parameter = angular.extend(angular.extend({}, default_parameter), parameter);

		return {
			peer: null,
			isFinishSignaling: 0,
			create: function() {
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
				},parameter.offerErrorCallback, parameter.sdp_opt);
			},
			answer: function() {
				this.peer.createAnswer(parameter.answerCallback, parameter.answerErrorCallback, parameter.sdp_opt);
			},
			setLocalDescription: function(description) {
				console.log("setLocalDescription",description);
				this.peer.setLocalDescription(description);
			},
			setRemoteDescription: function(description) {
				console.log("setRemoteDescription",description);
				this.peer.setRemoteDescription(description);
			},
			addIceCandidate: function(candidate) {
				console.log("addIceCandidate",candidate);
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
		errorCallback: function(error) {},
		notSupportCallback: function() {alert("This browser is not supported to getUserMedia in WebRTC.");}
	};

	return function(parameter) {
		parameter = angular.extend(angular.extend({}, default_parameter), parameter);

		return {
			getUserMedia: function() {
				try {
					console.log(parameter.constraints);
					window.getUserMedia(parameter.constraints, parameter.successCallback, parameter.errorCallback);
				} catch(e) {
					parameter.notSupportCallback();
				}
			}
		};
	};
}).factory('dataChannel', function() {
	var default_parameter = {
		label: "labelName",
		opt: { reliable:false },
		onmessage: function(e) {}
	};

	return function(parameter) {
		parameter = angular.extend(angular.extend({}, default_parameter), parameter);

		return {
			peer_connection: null,
			data_channel: null,
			create: function() {
				this.peer_connection = parameter.peer_connection;
				this.data_channel = this.peer_connection.peer.createDataChannel(parameter.label, parameter.opt);
				this.data_channel.onmessage = parameter.onmessage;
			},
			send: function(data) {
				this.data_channel.send(data);
			}
		};
	};	
});