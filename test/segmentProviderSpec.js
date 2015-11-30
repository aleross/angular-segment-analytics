describe('segmentProvider', function () {
    'use strict';

    var segmentProvider,
        segment;

    beforeEach(module('ngSegment', function (_segmentProvider_) {
        segmentProvider = _segmentProvider_;
    }));

    beforeEach(inject(function (_segment_) {
        segment = _segment_;
    }));

    /**
     * Config
     */
    it('should have the correct defaults', function () {
        inject(function (segmentDefaultConfig) {
            Object.keys(segmentDefaultConfig).forEach(function (key) {
                expect(segment.config[key]).toEqual(segmentDefaultConfig[key]);
            });
        });
    });

    it('should not modify default config', function () {
        inject(function (segmentDefaultConfig) {
            expect(segmentProvider.config.methods).not.toBe(segmentDefaultConfig.methods);
        });
    });

    it('should be able to chain functions', function () {
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

    /**
     * Validation
     */
    it('should validate the API key', function () {
        var error = new Error(segmentProvider.config.tag + 'API key must be a valid string.');
        expect(function () { segmentProvider.setKey(); }).toThrow(error);
    });

    it('should validate the condition callback', function () {
        var error = new Error(segmentProvider.config.tag + 'Condition callback must be a function.');
        expect(function () { segmentProvider.setCondition(); }).toThrow(error);
    });

    it('should validate the load delay', function () {
        var error = new Error(segmentProvider.config.tag + 'Load delay must be a number.');
        expect(function () { segmentProvider.setLoadDelay(); }).toThrow(error);
    });

    it('should validate config object', function () {
        var error = new Error(segmentProvider.config.tag + 'Config must be an object.');
        expect(function () { segmentProvider.setConfig(); }).toThrow(error);
    });

    it('should validate config object properties', function () {
        var error = new Error(segmentProvider.config.tag + 'API key must be a valid string.');
        expect(function () { segmentProvider.setConfig({ apiKey: null }); }).toThrow(error);
    });
});
