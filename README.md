# ngSegment: [Segment](https://segment.com) analytics for [AngularJS](https://angular.io/)
Highly configurable module for easily adding Segment analytics to any Angular app. Confguration via a provider, service, or constant.
## Table of Contents


## Installation

**Bower:**
`bower install angular-segment-analytics --save`

**npm:**
`npm install angular-segment-analytics`

Include `segment.min.js` in your `index.html`, after including Angular.

Add `'ngSegment'` to your main module's list of dependencies: `angular.module('myApp', ['ngSegment']);`


## Usage

The order they're applied in:

### Provider
### Constant

You can override any of the configuration options available in the defaultSegmentConfig constant. Constant values are only available _after_ the `module.run()` phrase of your app. If you need to provide configuration during the `module.config()` phrase, use `segmentProvider` instead.

```js
angular.module('myApp').constant('segmentConfig', {
  apiKey: 'xx',
  autoload: false
  condition: function ($rootScope) {
      return $rootScope.isProduction;
  }
});
```

### Service
```js
angular.module('myApp').controller(function (segment) {

    segment.setKey('xx');
    segment.setCondition(function ($rootScope) {
        return $rootScope.isProduction;
    });
});

```

## Configuration

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
