/**
 * @doc module
 * @name websocket
 * @description 웹소켓
 * 
 * 
 */


angular.module('webrtc-socket-module', []).
factory('WebrtcSocket', function() {
	/**
	 * @doc function
	 * @name utils.global:makeCooler
	 * @param  {string} string_in any ol' string
	 * @return {string} adds on the 'izzle'
	 * @description
	 * Man this function is the functionizzle of the heezy for sheezy.
	 *
	 * In fact, sometimes I like to use it to coolify everything
	 * ```js
	 * for(var thing in window) {
	 *     if(typeof(window[thing]) === "string") {
	 *         window[thing] = util.makeCooler(window[thing]);
	 *     }
	 * }
	 * ```
	 */	
	var default_parameter = {
		socket_server: "'http://localhost:3000'",
		onConnect: function() {},
		joinCallback: function() {},
		receiveSDPCallback: function(description) {},
		receiveReturnSDPCallback: function(description) {},
		receiveCandidateallback: function(candidate) {}
	};

	return function(parameter) {
		parameter = angular.extend(angular.extend({}, default_parameter), parameter);

		return {
			peer: null,
			socket: null,
			RTCSessionDescription: function() {
				if(typeof mozRTCSessionDescription != "undefined") return mozRTCSessionDescription
				return RTCSessionDescription;
			},
			RTCIceCandidate: function() {
				if(typeof mozRTCIceCandidate != "undefined") return mozRTCIceCandidate
				return RTCIceCandidate;
			},
			connect: function() {
				var that = this;

				this.socket = io.connect(parameter.socket_server);

				this.socket.on('connect', parameter.onConnect);
				this.socket.on('joinCallback', parameter.joinCallback);
				this.socket.on('receiveSDPCallback', function(description) {
					var RTCSessionDescription = that.RTCSessionDescription();
					description = new RTCSessionDescription(description);
					parameter.receiveSDPCallback(description);
				});
				this.socket.on('receiveReturnSDPCallback', function(description) {
					var RTCSessionDescription = that.RTCSessionDescription();
					description = new RTCSessionDescription(description);
					parameter.receiveReturnSDPCallback(description);
				});	
				this.socket.on('receiveCandidateallback', function(candidate) {
					var RTCIceCandidate = that.RTCIceCandidate()
					candidate = new RTCIceCandidate(candidate);
					parameter.receiveCandidateallback(candidate);
				});						
			},
			joinRoom: function() {
				this.socket.emit("joinRoom");
			},
			sendSDP: function(description) {
				description = JSON.parse(JSON.stringify(description));
				this.socket.emit("sendSDP", description);
			},
			returnSDP: function(description) {
				description = JSON.parse(JSON.stringify(description));
				this.socket.emit("returnSDP", description);
			},
			sendCandidate: function(candidate) {
				candidate = JSON.parse(JSON.stringify(candidate));
				this.socket.emit("sendCandidate", candidate);
			},
			disconnect: function() {
				this.socket.disconnect();
				this.socket = null;
			}
		};		
	};	
});