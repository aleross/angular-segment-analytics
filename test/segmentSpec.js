describe('segment', function () {
    'use strict';

    beforeEach(function () {

        // Clear any analytics.js method calls
        window.analytics.length = 0;
        module('ngSegment');
    });

    it('should have the correct defaults', function () {
        inject(function (segment, segmentDefaultConfig) {
            Object.keys(segmentDefaultConfig).forEach(function (key) {
                expect(segment.config[key]).toEqual(segmentDefaultConfig[key]);
            });
        });
    });

    it('should be able to debug log', function () {
        module('ngSegment', function (segmentProvider) {
            segmentProvider.setDebug(true);
        });

        spyOn(console, 'log');

        inject(function (segment) {
            segment.debug('Test debug');
            expect(console.log).toHaveBeenCalledWith(segment.config.tag + 'Test debug');
        });
    });

    it('should set events object on events property', function () {
        var events = { TEST: 'Test' };
        module('ngSegment', function (segmentProvider) {
            segmentProvider.setEvents(events);
        });

        inject(function (segment) {
            expect(segment.events.TEST).toEqual(events.TEST);
        });
    });

    it('should implement all Analytics.js methods from config', function () {
        inject(function (segment, segmentDefaultConfig) {
            segmentDefaultConfig.methods.forEach(function (method) {
                expect(typeof segment[method]).toEqual('function');
            });
        });
    });

    it('should inject callback with dependencies', function () {
        module('ngSegment', function (segmentProvider) {
            segmentProvider.setCondition(function ($http) {
                console.log('$http is a ' + typeof $http);
            });
        });

        spyOn(console, 'log');

        inject(function (segment) {
            segment.track('test');
            expect(console.log).toHaveBeenCalledWith('$http is a function');
        });
    });

    it('should call Analytics.js method if callback returns true', function () {
        module('ngSegment', function (segmentProvider) {
            segmentProvider.setCondition(function () {
                return true;
            });
        });

        inject(function (segment, $window) {
            segment.track('test');
            expect(typeof $window.analytics[0]).toEqual('object');
        });
    });

    it('should not call Analytics.js if condition callback returns false', function () {
        module('ngSegment', function (segmentProvider) {
            segmentProvider.setCondition(function () {
                return false;
            });
        });

        inject(function (segment, $window) {
            segment.track('test');
            expect($window.analytics[0]).toEqual(undefined);
        });
    });

    it('should allow the condition to be set with strict DI annotation', function () {
        module('ngSegment', ['segmentProvider', function (segmentProvider) {
            segmentProvider.setCondition(['$http', function ($http) {
                console.log('$http is a ' + typeof $http);
            }]);
        }]);
    });

    it('should queue method calls when used before Analytics.js has loaded', function () {
        inject(function (segment, $window) {
            segment.track('test');
            expect($window.analytics.length).toBe(1);
        });
    });
});
