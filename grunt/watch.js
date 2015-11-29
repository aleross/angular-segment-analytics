module.exports = {
    options: { livereload: false },
    js: {
        files: ['src/**/*.js'],
        tasks: ['build'],
    },
    livereload: {
        files: ['segment.js', 'example.html'],
        options: { livereload: true },
    },
};
