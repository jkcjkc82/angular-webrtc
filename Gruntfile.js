module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        docular: {
            groups: [
                {
                    groupTitle: "WebRTC Module",
                    groupId: "AngularWebRTCModule",
                    groupIcon: "icon-beer",                    
                    sections: [
                        {
                            id: "AngularWebRTCModule",
                            title: "AngularWebRTCModule",
                            // showSource : true,
                            scripts: [
                                "angular-webrtc-module.js",
                                "angular-webrtc-socket-module.js"
                            ]
                        }
                    ]
                }
            ]            
        }
    });

    grunt.loadNpmTasks('grunt-docular');

    grunt.registerTask('default', ['docular']);
};