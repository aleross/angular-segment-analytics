describe('segment', function () {
    'use strict';

    var segment,
        segmentProvider;

    beforeEach(module('ngSegment', function (_segmentProvider_) {
        segmentProvider = _segmentProvider_;
    }));

    beforeEach(inject(function (_segment_) {
        segment = _segment_;
    }));

    /**
     * Configuration
     */

    it('should provide the same configuration methods from provider and service', function () {

    });

    it('should be able to chain functions', function () {

    });

    it('should have the correct defaults', function () {
        inject(function (segmentDefaultConfig) {
            segment.config.debug = true;
            Object.keys(segmentDefaultConfig).forEach(function (key) {
                expect(segment.config[key]).toBe(segmentDefaultConfig[key]);
            });
        });
    });

    it('should be able to load settings from a constant', function () {

    });

    it('should be able to debug log', function () {

    });

    it('should not load Analytics.js automatically if autoload is not enabled', function () {

    });

    it('should set events object on events property', function () {

    });

    /**
     * Analytics.js API
     */

    it('should implement all Analytics.js methods from config', function () {

    });

    it('should not call Analytics.js if condition callback returns false', function () {

    });

    it('should queue method calls when used before Analytics.js has loaded', function () {

    });

    it('should reply queued method calls when Analytics.js loads', function () {

    });

    /**
     * Validation
     */

    it('should validate the API key', function () {

    });

    it('should validate the condition callback', function () {

    });

    it('should validate the load delay', function () {

    });

    it('should validate config constant', function () {

    });

    it('should validate config object', function () {

    });
});
