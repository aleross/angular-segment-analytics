module.exports = function(grunt) {

    // load grunt config
    require('load-grunt-config')(grunt, {

        // auto grunt.initConfig
        init: true,

        // Autoload tasks
        jitGrunt: {
            staticMappings: {
                coveralls: 'grunt-karma-coveralls'
            }
        },
    });
};
