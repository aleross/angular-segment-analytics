describe('segmentLoader', function () {
    'use strict';

    beforeEach(function () {
        module('ngSegment');
        window.analytics.initialized = false;
    });

    it('should require an API key to load Analytics.js', function () {
        inject(function (segmentLoader) {
            var error = new Error('Cannot load Analytics.js without an API key.');
            expect(segmentLoader.load).toThrow(error);
        });
    });

    it('should not allow loading Analytics.js twice', function () {
        inject(function (segmentLoader) {
            segmentLoader.load('abc');
            expect(function () {
                segmentLoader.load('abc');
            }).toThrow(new Error('Attempting to load Segment twice.'));
        });
    });

    it('should not allow loading Analytics.js if it has already been included', function () {
        inject(function (segment, segmentLoader) {
            window.analytics.initialized = true;
            expect(function () {
                segmentLoader.load('abc');
            }).toThrow(new Error('Attempting to load Segment twice.'));
        });
    });

    it('should not load Analytics.js automatically if autoload is not enabled', function () {
        module('ngSegment', function (segmentProvider) {
            segmentProvider.setKey('abc').setAutoload(false);
        });

        inject(function (segment, segmentLoader) {
            expect(segmentLoader.hasLoaded).toEqual(false);
        });
    });
});
