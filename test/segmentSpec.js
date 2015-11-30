describe('segment', function () {
    'use strict';

    beforeEach(module('ngSegment'));

    it('should be able to debug log', function () {

    });

    it('should not load Analytics.js automatically if autoload is not enabled', function () {

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
});
