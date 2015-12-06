module.exports = {

    options: {

        // Using all defaults
        files: ['package.json', 'bower.json'],
        commit: 'true',
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        createTag: true,
        push: true,
        pushTo: 'origin',
    },
};
