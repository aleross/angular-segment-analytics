(function (module) {

    var hasLoaded = false;

    function SegmentLoader() {

        this.load = function (apiKey, delayMs) {

            if (hasLoaded) {
                console.warn('Attempting to load Segment twice.');
            } else {

                // Only load if we've been given or have set an API key
                if (apiKey) {

                    // Prevent double .load() calls
                    hasLoaded = true;

                    window.setTimeout(function () {

                        // Create an async script element based on your key.
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        script.src = ('https:' === document.location.protocol
                                ? 'https://' : 'http://')
                            + 'cdn.segment.com/analytics.js/v1/'
                            + apiKey + '/analytics.min.js';

                        script.onerror = function () {
                            console.error('Error loading Segment library.');
                        };

                        // Insert our script next to the first script element.
                        var first = document.getElementsByTagName('script')[0];
                        first.parentNode.insertBefore(script, first);
                    }, delayMs);
                } else {
                    console.warn('Cannot load Segment without an API key.');
                }
            }
        };
    }

    function SegmentLoaderProvider() {

        // Inherit .load()
        SegmentLoader.call(this);

        this.$get = function () {
            return new SegmentLoader();
        }
    }

    // Register with Angular
    module.provider('segmentLoader', SegmentLoaderProvider);

})(angular.module('ngSegment'));
