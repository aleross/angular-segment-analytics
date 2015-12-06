describe('segmentConfig', function () {
    'use strict';

    beforeEach(module('ngSegment'));

    it('should be able to set configuration options from user-provided constant', function () {
        module('ngSegment', function ($provide) {
            $provide.constant('segmentConfig', {
                apiKey: 'abc',
                autoload: false,
                loadDelay: 1000,
                debug: false,
                methods: [],
                tag: '[Test] ',
            });
        });

        inject(function (segmentConfig, segment) {
            Object.keys(segmentConfig).forEach(function (key) {
                expect(segment.config[key]).toEqual(segmentConfig[key]);
            });
        });
    });

    it('should validate settings in user-provided constant', function () {

        function badConstant() {
            module('ngSegment', function ($provide) {
                $provide.constant('segmentConfig', { apiKey: null });
            });

            inject(function (segment) {});
        }

        expect(badConstant).toThrow();
    });
});
