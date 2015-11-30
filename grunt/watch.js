module.exports = {
    options: { livereload: false },
    js: {
        files: ['src/**/*.js'],
        tasks: ['karma:watch:run', 'build'],
    },
    livereload: {
        files: ['segment.js', 'example.html'],
        options: { livereload: true },
    },
};
