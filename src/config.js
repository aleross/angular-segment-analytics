angular.module('ngSegment').constant('segmentDefaultConfig', {
    apiKey: null,
    autoload: true,
    loadDelay: 0,
    condition: null,
    debug: true,
    version: '3.1.0',
    methods: [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'reset',
        'group',
        'track',
        'ready',
        'alias',
        'page',
        'once',
        'off',
        'on'
    ],
    tag: '[ngSegment] '
});
