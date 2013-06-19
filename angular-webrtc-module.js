angular.module('webrtc-module', []).
factory('peerConnection2', function() {
	return function() {
		return {
			create: function() {
				var that = this;
				// console.log("peerConnection.create()");
				var servers = {
					iceServers:[{
						// url:"stun:50.112.159.100"
						url:"stun:stun.l.google111.com:19302"						
						// url: "stun:23.21.150.121"
					}]
				};	
				// var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};	
				// {"iceServers":[{"url":"stun:23.21.150.121"}]}
				var PeerConnection = typeof webkitRTCPeerConnection != "undefined" ? webkitRTCPeerConnection : mozRTCPeerConnection;				
				var peerConnection = new PeerConnection(servers,{
				  optional: [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }]
				});

				peerConnection.onaddstream = function(e) {
					that.onaddtream(e);
				};		
				peerConnection.onremovestream = function() {
					console.log("onremovestream");
				};
				peerConnection.ondatachannel = function() {
					console.log("ondatachannel");
				};	
				peerConnection.onconnection = function() {
					console.log("onconnection peer");
				};			

				this.peer = peerConnection;
			},
			candidate: function(callback) {
				var that = this;
				this.peer.onicecandidate = function(e) {
					console.log("candidate start");
					if(!e.candidate) {
						return;
					}

					callback(e);
				};
			},
			offer: function(callback) {
				var that = this;
				// console.log("peerConnection.offer()");
				var offer = this.peer.createOffer(function(description) {					
					console.log("1. offer - setLocalDescription",description);
					that.peer.setLocalDescription(description);				

					callback(description);
				});	
			},
			answer: function(description,callback) {
				var that = this;
				// console.log("peerConnection.answer()");
				// description.sdp = transformOutgoingSdp(description.sdp);
				console.log("2. answer - setRemoteDescription",description);
				this.peer.setRemoteDescription(description);

				this.peer.createAnswer(function(description) {
					callback(description);
				});			
			}
		};
	};
}).factory('peerConnection', function() {	
	var default_parameter = {
		onaddstream: function(e) {},
		onremovestream: function(e) {},
		ondatachannel: function(e) {},
		onconnection: function(e) {},
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
		parameter = angular.extend(default_parameter, parameter);

		return {
			peer: null,
			create: function() {
				var that = this;
				var servers = {

				};
				var PeerConnection = typeof webkitRTCPeerConnection != "undefined" ? webkitRTCPeerConnection : mozRTCPeerConnection;				
				this.peer = new PeerConnection(parameter.servers, parameter.configuration);

				this.peer.onaddstream = parameter.onaddstream;
				this.peer.onremovestream = parameter.onremovestream;
				this.peer.ondatachannel = parameter.ondatachannel;
				this.peer.onconnection = parameter.onconnection;
			}
		}
	}	
}).factory('socket', function() {
	return function() {
		return {
			peer: null,
			socket: null,
			create: function() {
				// 소켓 연결
				this.socket = io.connect('http://localhost:3000');
				// this.socket = io.connect('http://localhost:3000');
			},
			onConnect: function(callback) {
				var that = this;
				this.socket.on('connect', function() {			
					that.socket.emit("join");
					callback();
				});
			},
			onRes: function(callback) {
				var that = this;
				// 소켓 응답
				this.socket.on("res",function(res) {
					// console.log("onRes.callback()",res);
					var type = 0;

					if(res.candidate && typeof(res.candidate) != "undfined") {
						type = 1;
					} else if(res.description && typeof(res.description) != "undefined") {
						if(res.description.type == "answer") {
							type = 2;
						} else if(res.description.type == "offer") {
							type = 3;											
						}					
					}			

					callback(type,res);
				});		
			}
		};		
	};
}).factory('mediastream', function() {
	var default_parameter = {
		constraints: {
			"audio": true, 
			"video": true
		},
		successCallback: function(stream) {},
		errorCallback: function(error) {}
	};

	return function(parameter) {
		parameter = angular.extend(default_parameter, parameter);

		return {
			getUserMedia: function() {
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				navigator.getUserMedia(parameter.constraints, parameter.successCallback, parameter.errorCallback);	
			}
		};
	};
});


