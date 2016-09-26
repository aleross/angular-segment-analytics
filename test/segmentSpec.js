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

        inject(function (segment, $log) {
            $log.reset();
            segment.debug('Test debug');
            expect(
              $log.log.logs[0]
            ).toContain(segment.config.tag + 'Test debug');
        });
    });

    it('should be able to set custom log level', function () {
        module(function (segmentProvider) {
            segmentProvider.setDebug(true);
            segmentProvider.setDebugLevel('info');
        });

        inject(function (segment, $log) {
            $log.reset();
            segment.debug('Test debug');

            expect(
              $log.log.logs[0]
            ).not.toContain(segment.config.tag + 'Test debug');

            expect(
              $log.info.logs[0]
            ).toContain(segment.config.tag + 'Test debug');
        });
    });

    describe('logger', function () {
        beforeEach(module(function (segmentProvider) {
            segmentProvider.setDebug(true);
        }));

        it('should be able to set custom logger as a service name', function () {
            module('ngSegment', function (segmentProvider) {
                segmentProvider.setLogger('$log');
            });

            inject(function (segment, $log) {
                spyOn($log, 'log');

                segment.debug('Test debug');
                expect($log.log).toHaveBeenCalledWith(segment.config.tag + 'Test debug');
            });
        });

        it('should be able to set custom logger as an object', function () {
            var logger = {
                log: jasmine.createSpy('logger.log'),
            };

            module(function (segmentProvider) {
                segmentProvider.setLogger(logger);
            });

            inject(function (segment) {
                segment.debug('Test debug');
                expect(logger.log).toHaveBeenCalledWith(segment.config.tag + 'Test debug');
            });
        });

        it('should be able to set custom logger a function', function () {
            var logger = jasmine.createSpy('logger function');

            module(function (segmentProvider) {
                segmentProvider.setLogger(logger);
            });

            inject(function (segment) {
                segment.debug('Test debug');
                expect(logger).toHaveBeenCalledWith(segment.config.tag + 'Test debug');
            });
        });

        it('should bind custom logger function context with undefined (to' +
          ' prevent exposing on-the-go logger creation)', function () {
            var dynamicContextFromLoggerFunction;

            var logger = function () {
                dynamicContextFromLoggerFunction = this;
            };

            module(function (segmentProvider) {
                segmentProvider.setLogger(logger);
            });

            inject(function (segment) {
                dynamicContextFromLoggerFunction = 'initialValue';
                segment.debug('Test debug');
                expect(dynamicContextFromLoggerFunction).toBe(undefined);
            });
        });

        it('should use logger from `segmentConfig` constant', function () {
            var loggerMethod = jasmine.createSpy('testLogger.spy');

            module(function ($provide) {
                $provide.service('testLogger', function () {
                    return {
                        log: loggerMethod,
                    }
                });
                $provide.constant('segmentConfig', {
                    logger: 'testLogger',
                })
            });

            inject(function (segment) {
                segment.debug('Test debug');
                expect(loggerMethod).toHaveBeenCalledWith(segment.config.tag + 'Test debug');
            });
        });

        it('should warn if `segmentConfig` misconfigures `logger`', function () {
            module(function ($provide) {
                $provide.constant('segmentConfig', {
                    logger: false,
                })
            });

            expect(function () {
                inject(function (segment) {
                });
            }).toThrow();
        });

        it('should use $log if logger is set to null', function () {
            module(function ($provide) {
                $provide.constant('segmentConfig', {
                    logger: null,
                })
            });

            inject(function (segment, $log) {
                $log.reset();
                segment.debug('Test debug');
                expect(
                  $log.log.logs[0]
                ).toContain(segment.config.tag + 'Test debug');
            });
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
