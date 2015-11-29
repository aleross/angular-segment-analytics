angular.module('ngSegment', []);

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
    debug: true,

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
        'on'
    ],

    // Tag: the tag used in debug log statements
    tag: '[ngSegment] '
});

(function (module) {

    var hasLoaded = false;

    function SegmentLoader() {

        this.load = function (apiKey, delayMs) {

            if (hasLoaded) {
                console.warn('Attempting to load Segment twice.');
            } else {

                // Only load if we've been given or have set an API key
                if (apiKey) {

                    // Prevent double .load() calls
                    hasLoaded = true;

                    window.setTimeout(function () {

                        // Create an async script element based on your key.
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        script.src = ('https:' === document.location.protocol
                                ? 'https://' : 'http://')
                            + 'cdn.segment.com/analytics.js/v1/'
                            + apiKey + '/analytics.min.js';

                        script.onerror = function () {
                            console.error('Error loading Segment library.');
                        };

                        // Insert our script next to the first script element.
                        var first = document.getElementsByTagName('script')[0];
                        first.parentNode.insertBefore(script, first);
                    }, delayMs);
                } else {
                    console.warn('Cannot load Segment without an API key.');
                }
            }
        };
    }

    function SegmentLoaderProvider() {

        // Inherit .load()
        SegmentLoader.call(this);

        this.$get = function () {
            return new SegmentLoader();
        }
    }

    // Register with Angular
    module.provider('segmentLoader', SegmentLoaderProvider);

})(angular.module('ngSegment'));

(function (module) {

    var analytics = window.analytics = window.analytics || [];

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    if (analytics.invoked) {
        console.error('Segment or ngSegment included twice.');
    } else {
        analytics.invoked = true;
    }

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function(method) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            analytics.push(args);
            return analytics;
        };
    };


    function Segment(config) {

        this.config = config;

        // Checks condition before calling Segment method
        this.factory = function (method) {
            return (function () {

                // If a condition has been set, only call the Segment method if it returns true
                if (this.config.condition && !this.config.condition(method, arguments)) {
                    this.debug('Not calling method, condition returned false.', {
                        method: method,
                        arguments: arguments
                    });
                    return;
                }

                //  No condition set, call the Segment method
                this.debug('Calling method ' + method + ' with arguments:', arguments);
                return analytics[method].apply(analytics, arguments);
            }).bind(this);
        };
    }

    // Methods available on both segment service and segmentProvider
    Segment.prototype = {

        // Creates analytics.js method stubs
        init: function () {
            for (var i = 0; i < this.config.methods.length; i++) {
                var key = this.config.methods[i];

                // Only create analytics stub if it doesn't already exist
                if (!analytics[key]) {
                    analytics[key] = analytics.factory(key);
                }

                this[key] = this.factory(key);
            }
        },

        debug: function () {
            if (this.config.debug) {
                arguments[0] = this.config.tag + arguments[0];
                console.log.apply(console, arguments);
            }
        },

        setKey: function (apiKey) {
            this.config.apiKey = apiKey;
            return this;
        },

        setLoadDelay: function (milliseconds) {
            this.config.loadDelay = milliseconds;
            return this;
        },

        setCondition: function (callback) {
            this.config.condition = callback;
            return this;
        },

        setEvents: function (events) {
            this.events = events;
            return this;
        },

        setDebug: function (bool) {
            this.config.debug = bool;
            return this;
        },

        setConfig: function (config) {
            angular.extend(this.config, config);
            return this;
        },

        setAutoload: function (bool) {
            this.config.autoload = bool;
            return this;
        }
    };


    function SegmentProvider(segmentDefaultConfig) {

        Segment.call(this, segmentDefaultConfig);

        // Stores any analytics.js method calls
        this.queue = [];

        // Overwrite Segment factory to queue up calls if condition has been set
        this.factory = function (method) {
            return (function () {

                // Defer calling analytics.js methods until the service is instantiated if the user
                // has set a condition, so that the condition can be injected with dependencies
                if (typeof this.config.condition === 'function') {
                    this.queue.push({ method: method, arguments: arguments });
                } else {
                    this[method].apply(this, arguments);
                }
            }).bind(this);
        };

        // Create method stubs using overridden factory
        this.init();

        // Returns segment service and creates dependency-injected condition callback, if provided
        this.$get = function ($injector, segmentLoader) {

            // Apply user-provided config constant if it exists
            if ($injector.has('segmentConfig')) {
                angular.extend(this.config, $injector.get('segmentConfig'));
                this.debug('Found segment config constant');
            }

            // Autoload Segment on service instantiation if an API key has been set via the provider
            if (this.config.autoload) {
                if (this.config.apiKey) {
                    this.debug('Not autoloading Analytics.js, no API key has been set.');
                } else {
                    this.debug('Autoloading Analytics.js');
                    segmentLoader.load(this.config.apiKey, this.config.loadDelay);
                }
            }

            // Create dependency-injected condition
            if (typeof this.config.condition === 'function') {
                var condition = this.config.condition;
                this.config.condition = function (method, params) {
                    return $injector.invoke(condition, condition, { method: method, params: params });
                };
            }

            // Pass any provider-set configuration down to the service
            var segment = new Segment(this.config);

            // Set up service method stubs
            segment.init();

            // Play back any segment calls that were made against the provider now that the
            // condition callback has been injected with dependencies
            this.queue.forEach(function (item) {
                segment[item.method].apply(segment, item.arguments);
            });

            return segment;
        };
    }

    SegmentProvider.prototype = Object.create(Segment.prototype);

    // Register with Angular
    module.provider('segment', ['segmentDefaultConfig', SegmentProvider]);

})(angular.module('ngSegment'));
