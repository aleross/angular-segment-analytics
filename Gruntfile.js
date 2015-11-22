module.exports = function(grunt) {

    // load grunt config
    require('load-grunt-config')(grunt, {

        // auto grunt.initConfig
        init: true,

        // Needed to know which tasks to load
        loadGruntTasks: {

            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });
};
