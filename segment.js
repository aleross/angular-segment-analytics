angular.module('ngSegment').provider('segment', function () {
    'use strict';

    // Set up Segment global object and event queue. Enables service to be called before script has loaded.
    var analytics = window.analytics = window.analytics || [],
        service = {},
        condition,
        tag = '[Segment] ',
        apiKey,
        loadDelayMs = 0;

    // If the real analytics.js is already on the page return. Todo we want this?
    if (analytics.initialize) return;

    // If the snippet was invoked already show an error. Todo we want this?
    if (analytics.invoked) {
        if (window.console && console.error) {
            console.error(tag + 'Segment snippet included twice.');
        }
        return;
    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    analytics.invoked = true;

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = '3.1.0';

    // A list of the methods in Analytics.js to stub.
    analytics.methods = [
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
    ];

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

    // AngularJS segment service
    service.factory = function (method) {
        return function () {

            // If a condition has been set, only call the Segment method if it returns true
            if (service.condition && !service.condition(method, arguments)) {
                debug('Track condition returned false.');
                return;
            }

            //  No condition set, call the Segment method
            debug(method, arguments);
            return analytics[method].apply(this, arguments);
        }
    };

    // For each of our methods, generate a queueing stub and service stub.
    for (var i = 0; i < analytics.methods.length; i++) {
        var key = analytics.methods[i];
        analytics[key] = analytics.factory(key);
        service[key] = service.factory(key);
    }

    /**
     * Asynchronously loads Segment library using the set API key.
     */
    function loadSegment() {
        if (apiKey) {

            window.setTimeout(function () {

                // Create an async script element based on your key.
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = ('https:' === document.location.protocol
                        ? 'https://' : 'http://')
                    + 'cdn.segment.com/analytics.js/v1/'
                    + apiKey + '/analytics.min.js';
                script.onload = function () {
                    debug('Segment script loaded.');
                };
                script.onerror = function () {
                    console.warn(tag + 'Error loading Segment library.');
                };

                // Insert our script next to the first script element.
                var first = document.getElementsByTagName('script')[0];
                first.parentNode.insertBefore(script, first);
            }, loadDelayMs);
        } else {
            console.warn(tag + 'API key not specified.');
        }
    }

    this.setDelay = function (delayMs) {
        loadDelayMs = delayMs;
    };

    this.setKey = function (key) {
        apiKey = key;
        debug('Set API key:', key);
        loadSegment();
    };

    this.setCondition = function (injectableCondition) {
        debug('Set tracking condition.');
        condition = injectableCondition;
    };

    this.setEvents = function (events) {
        debug('Set events:', events);
        service.events = events;
    };

    this.enableDebug = function () {
        service.debug = true;
        debug('Enabled debug mode.');
    };

    // Returns segment service
    this.$get = ['$injector', '$rootScope', '$location', function ($injector, $rootScope, $location) {

        // Make condition injectable
        if (typeof condition === 'function') {
            service.condition = function (method, params) {
                return $injector.invoke(condition, condition, { method: method, params: params });
            };
        }

        // Automatically track pageviews on route change success
        $rootScope.$on('$routeChangeSuccess', function () {
            service.pageview($location.path());
        });

        return service;
    }];

    // Debug logging. Enable with segmentProvider.enableDebug(); or segment.debug = true;
    function debug() {
        if (service.debug) {
            arguments[0] = tag + arguments[0];
            console.log.apply(console, arguments);
        }
    }
});
