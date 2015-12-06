describe('segmentProvider', function () {
    'use strict';

    beforeEach(module('ngSegment'));

    /**
     * Config
     */
    it('should have the correct defaults', function () {
        var segmentProvider;
        module('ngSegment', function (_segmentProvider_) {
            segmentProvider = _segmentProvider_;
        });

        inject(function (segmentDefaultConfig) {
            Object.keys(segmentDefaultConfig).forEach(function (key) {
                expect(segmentProvider.config[key]).toEqual(segmentDefaultConfig[key]);
            });
        });
    });

    it('should not reference default config', function () {
        var segmentProvider;
        module('ngSegment', function (_segmentProvider_) {
            segmentProvider = _segmentProvider_;
        });

        inject(function (segmentDefaultConfig) {
            expect(segmentProvider.config.methods).not.toBe(segmentDefaultConfig.methods);
        });
    });

    it('should be able to chain functions', function () {
        var segmentProvider;
        module('ngSegment', function (_segmentProvider_) {
            segmentProvider = _segmentProvider_;
        });

        inject(function (segmentDefaultConfig) {
            expect(segmentProvider.setKey('abc')).toBe(segmentProvider);
            expect(segmentProvider.setDebug(segmentDefaultConfig.loadDelay)).toBe(segmentProvider);
            expect(segmentProvider.setCondition(function () {})).toBe(segmentProvider);
            expect(segmentProvider.setEvents({})).toBe(segmentProvider);
            expect(segmentProvider.setConfig({})).toBe(segmentProvider);
            expect(segmentProvider.setDebug(segmentDefaultConfig.debug)).toBe(segmentProvider);
            expect(segmentProvider.setAutoload(segmentDefaultConfig.autoload)).toBe(segmentProvider);
        });
    });

    it('should queue method calls when a condition has been set', function () {
        module('ngSegment', function (segmentProvider) {
            segmentProvider.track('test');
            expect(segmentProvider.queue.length).toBe(1);
        });

        inject(function (segment) {});
    });

    /**
     * Validation
     */
    it('should validate the API key', function () {
        module('ngSegment', function (segmentProvider) {
            expect(function () {
                segmentProvider.setKey();
            }).toThrow(new Error(segmentProvider.config.tag + 'API key must be a valid string.'));
        });

        inject(function (segment) {});
    });

    it('should validate the condition callback', function () {
        module('ngSegment', function (segmentProvider) {
            expect(function () {
                segmentProvider.setCondition();
            }).toThrow(new Error(segmentProvider.config.tag + 'Condition callback must be a function.'));
        });

        inject(function (segment) {});
    });

    it('should validate the load delay', function () {
        module('ngSegment', function (segmentProvider) {
            expect(function () {
                segmentProvider.setLoadDelay();
            }).toThrow(new Error(segmentProvider.config.tag + 'Load delay must be a number.'));
        });

        inject(function (segment) {});
    });

    it('should validate config object', function () {
        module('ngSegment', function (segmentProvider) {
            expect(function () {
                segmentProvider.setConfig();
            }).toThrow(new Error(segmentProvider.config.tag + 'Config must be an object.'));
        });

        inject(function (segment) {});
    });

    it('should validate config object properties', function () {
        module('ngSegment', function (segmentProvider) {
            expect(function () {
                segmentProvider.setConfig({ apiKey: null });
            }).toThrow(new Error(segmentProvider.config.tag + 'API key must be a valid string.'));
        });

        inject(function (segment) {});
    });
});
