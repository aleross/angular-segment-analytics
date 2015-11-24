# ngSegment: [Segment](https://segment.com) analytics for [AngularJS](https://angular.io/)
A highly configurable module for easily adding Segment analytics to any Angular app.


## Installation

**Bower:**
`bower install angular-segment-analytics --save`

**npm:**
`npm install angular-segment-analytics`

Include `segment.min.js` in your `index.html`, after including Angular.

Add `'ngSegment'` to your main module's list of dependencies: `angular.module('myApp', ['ngSegment']);`


## Usage

All you need to start using Segment is to set your API key using any of the configuration methods provided (**provider**, **constant**, or **service**).

```js
// analytics.js will be asynchronously autoloaded
segmentProvider.setKey('abc');
```

All Segment methods (see [Analytics.js](https://segment.com/docs/libraries/analytics.js/)) are available. You can begin using the `segment` service immediately, even before configuration or before the analytics.js script has been loaded. Method calls will be queued and replayed once the service has been configured and the script has been loaded.

```js
$scope.myAction = function () {
    segment.track('action', { prop: 'value' });
});
```

Continue reading about the configuration options, or jump to the API documentation.


## Configuration Options

### Provider

Read the AngularJS documentation to learn more about [module configuration blocks](https://docs.angularjs.org/guide/module#module-loading-dependencies).

```js
angular.module('myApp').config(function (segmentProvider) {
    segmentProvider
        .setKey('abc')
        .setCondition(function ($rootScope) {
            return $rootScope.isProduction;
        });
});
```

All of the [analytics.js](https://segment.com/docs/libraries/analytics.js/) methods are available on both the `segmentProvider` and `segment` service. You might want to call [.identify()](https://segment.com/docs/libraries/analytics.js/#identify) during your app's config block if you have your user's information available at that time:
```js
angular.module('myApp').config(function (segmentProvider) {
    segmentProvider.identify('user-id', {});
});
```
Read more about calling analytics.js in the API Documentation.

### Constant

You can set any of the configuration options available by providing your own `segmentConfig` constant. You only need to register your constant with your own app, and the `segmentProvider` will load the settings it provides.

Your `segmentConfig` constant should overwrite the properties found in [segmentDefaultConfig](https://github.com/aleross/angular-segment-analytics/blob/master/src/config.js). Any properties not overridden will default to the values found in that file.

Read more about [AngularJS constants](https://docs.angularjs.org/api/auto/service/$provide#constant).

**Example:**

```js
angular.module('myApp').constant('segmentConfig', {

  // These values will be automatically
  // loaded by the segment service
  apiKey: 'abc',
  condition: function ($rootScope) {
      return $rootScope.isProduction;
  }
});
```

### Service
```js
angular.module('myApp').controller(function (segment) {

    segment.setKey('abc');
    segment.setCondition(function ($rootScope) {
        return $rootScope.isProduction;
    });
});

```

## Configuration API

All configuration methods are chainable: `segmentProvider.setKey('xx').setAutoload(false).setDebug(true);`

### segment.setKey

### setCondition
**Default:* none
```js
// Disable tracking for non-production environments
segmentProvider.setCondition(function ($rootScope) {
    return !$rootScope.environment.isProduction;
});
```

The callback function is also injected with the analytics.js method name and arguments being called.
```js
// Disble tracking for admin users
segmentProvider.setCondition(function ($rootScope, method, arguments) {
    if (!(method === 'track' and $rootScope.user.isAdmin)) {
        return true;
    }
});
```

### setAutoload
**Default:** `true`

If you set autoload to false, you can later load the Segment analytics.js script on-demand using the `segmentLoader` or `segmentLoaderProvider`:

```js
  segment.loader(segment.config.apiKey);
```

### segment.setDelay
**Default:** `0ms` (no delay)

### setEvents(object)
**Default:** none

### setDebug
**Default:* `false`

### setConfig(object)



## API Documentation

Implements these methods from analytics.js

### Page tracking
```js
$rootScope.$on('$routeChangeSuccess', function () {
  segment.pageview($location.path());
});

### Event tracking
```js
$scope.myAction = function () {
  segment.track();
});
```
