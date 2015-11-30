angular.module('ngSegment').constant('segmentDefaultConfig', {

    // API key: The https://segment.com API key to be used when loading analytics.js.
    // Must be set before loading the analytics.js script.
    apiKey: null,

    // Autoload: if true, analytics.js will be asynchronously
    // loaded after the app's .config() cycle has ended
    autoload: true,

    // Load delay: number of milliseconds to defer loading
    // analytics.js.
    loadDelay: 0,

    // Condition: callback function to be checked before making an API call
    // against segment. Can be dependency-injected, and is passed the method name
    // and arguments of the analytics.js call being made. Useful for disabling
    // certain or all analytics.js functionality for certain users or in certain
    // application states.
    condition: null,

    // Debug: turns debug statements on/off. Useful during development.
    debug: false,

    // Methods: the analytics.js methods that the service creates queueing stubs for.
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
        'on',
    ],

    // Tag: the tag used in debug log statements
    tag: '[ngSegment] ',
});
