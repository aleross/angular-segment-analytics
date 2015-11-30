describe('segmentLoader', function () {
    'use strict';

    beforeEach(module('ngSegment'));

    it('should require an API key to load Analytics.js', function () {

    });

    it('should not allow loading Analytics.js twice', function () {

    });

    it('should not load Analytics.js automatically if autoload is not enabled', function () {
        module('ngSegment', function (segmentProvider) {
            segmentProvider.setKey('abc').setAutoload(false);
        });

        inject(function (segment, segmentLoader) {
            expect(segmentLoader.hasLoaded()).toEqual(false);
        });
    });
});
