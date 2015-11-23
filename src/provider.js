(function (module) {

    var analytics = window.analytics = window.analytics || [];

    if (analytics.initialize) {

    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    if (analytics.invoked) {
        console.error('Segment snippet included twice.');
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

        console.log('Segment config:', config);

        this.config = config;

        // Set global analytics.js version
        analytics.SNIPPET_VERSION = this.config.version;

        this.setKey = function (apiKey) {
            this.config.apiKey = apiKey;
            return this;
        };

        this.setLoadDelay = function (milliseconds) {
            this.config.loadDelay = milliseconds;
            return this;
        };

        this.setCondition = function (trackCondition) {
            this.config.condition = trackCondition;
            return this;
        };

        // Todo
        this.setEvents = function (events) {

            return this;
        };

        this.setConfig = function (config) {
            angular.extend(this.config, config);
            return this;
        };

        this.setDebug = function (bool) {
            this.config.debug = bool;
            return this;
        };

        this.setAutoload = function (bool) {
            this.config.autoload = bool;
            return this;
        };
    }

    Segment.prototype.factory = function (method) {

    };

    function SegmentProvider(segmentDefaultConfig) {

        // Inherit service methods
        Segment.call(this, segmentDefaultConfig);

        // Stores any analytics.js method calls
        this.queue = [];
        this.factory = function (method) {
            return (function () {

                // Defer calling analytics.js methods until the service is instantiated if the user
                // has set a condition, so that the condition can be injected with dependencies
                if (typeof this.config.condition === 'function') {
                    this.queue.push({ method: method, arguments: arguments });
                } else {

                }
            }).bind(this);
        };

        this.$get = function ($injector, segmentLoader) {

            // Apply user-provided config constant if it exists
            if ($injector.has('segmentConfig')) {
                angular.extend(this.config, $injector.get('segmentConfig'));
            }

            // Autoload Segment on service instantiation if an API key has been set via the provider
            if (this.config.autoload && this.config.apiKey) {
                segmentLoader.load(this.config.apiKey, this.config.loadDelay);
            }

            // Pass any provider-set configuration down to the service
            var segment = new Segment(this.config);

            // Run through any segment calls that were made against the provider
        };
    }

    // Register with Angular
    module.provider('segment', ['segmentDefaultConfig', SegmentProvider]);

})(angular.module('ngSegment'));
