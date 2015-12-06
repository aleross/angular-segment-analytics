module.exports = {
    options: {
        files: [
            'bower_components/bind-polyfill/index.js', // PhantomJS 1.x doesn't support Function.prototype.bind
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'segment.js',
            'test/*.js',
        ],
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
    },
    unit: {
        singleRun: true,
    },
    watch: {
        singleRun: false,
        background: true,
    },
};
