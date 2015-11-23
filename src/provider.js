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

        this.setEvents = function (events) {
            this.events = events;
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

        // Creates analytics.js method stubs
        this.init = function () {
            for (var i = 0; i < this.config.methods.length; i++) {
                var key = this.config.methods[i];

                // Only create analytics stub if it doesn't already exist
                if (!analytics[key]) {
                    analytics[key] = analytics.factory(key);
                }

                this[key] = this.factory(key);
            }
        };

        // Checks condition before calling Segment method
        this.factory = function (method) {
            var condition = this.config.condition;
            return function () {

                // If a condition has been set, only call the Segment method if it returns true
                if (condition && !condition(method, arguments)) {
                    return;
                }

                //  No condition set, call the Segment method
                return analytics[method].apply(analytics, arguments);
            }
        };
    }


    function SegmentProvider(segmentDefaultConfig) {

        // Inherit service methods
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

        // Returns segment service and optionally injected condition callback
        this.$get = function ($injector, segmentLoader) {

            // Apply user-provided config constant if it exists
            if ($injector.has('segmentConfig')) {
                angular.extend(this.config, $injector.get('segmentConfig'));
            }

            // Autoload Segment on service instantiation if an API key has been set via the provider
            if (this.config.autoload && this.config.apiKey) {
                segmentLoader.load(this.config.apiKey, this.config.loadDelay);
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

            // Play back any segment calls that were made against the provider
            this.queue.forEach(function (item) {
                segment[item.method].apply(segment, item.arguments);
            });

            return segment;
        };
    }

    // Register with Angular
    module.provider('segment', ['segmentDefaultConfig', SegmentProvider]);

})(angular.module('ngSegment'));
