module.exports = {

    options: {

        // Using all defaults
        files: ['package.json'],
        commit: 'true',
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: false,
        push: false
    }
};
