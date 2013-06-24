module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        docular: {
            groups: [
                {
                    groupTitle: "angular webrtc APIs",
                    groupId: "angular-webrtc-apis",
                    groupIcon: "icon-beer",                    
                    sections: [
                        {
                            id: "angular-webrtc",
                            title: "Angular WebRTC",
                            scripts: [
                                "angular-webrtc-module.js"
                            ],
                            showSource : true
                        },
                        {
                            id: "angular-webrtc-socket",
                            title: "Angular WebRTC Socket",
                            scripts: [
                                "angular-webrtc-socket-module.js"
                            ],
                            showSource : true
                        },                        
                    ]
                }
            ]            
        }
    });

    grunt.loadNpmTasks('grunt-docular');

    grunt.registerTask('default', ['docular']);
};