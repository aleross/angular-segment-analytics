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

Simply set your API key using any of the configuration methods provided (**provider**, **constant**, or **service**), and you're ready to start using Segment. See the Configuration API for advanced configuration.

```js
// analytics.js will be asynchronously autoloaded
segmentProvider.setKey('abc');
```

Most Segment methods (see [Analytics.js](https://segment.com/docs/libraries/analytics.js/)) are available. You can begin using the `segment` service immediately, even before setting your API key or before the analytics.js script has been asynchronously loaded. Method calls will be queued and replayed once Analytics.js is available.

```js
// Event tracking
$scope.myAction = function () {
    segment.track('action', { prop: 'value' });
});

// Pageview tracking
$rootScope.$on('$routeChangeSuccess', function () {
  segment.pageview($location.path());
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

```js
angular.module('myApp').constant('segmentConfig', {

  // These values will automatically be loaded by the segment service
  apiKey: 'abc',
  condition: function ($rootScope) {
      return $rootScope.isProduction;
  }
});
```

### Service

Usually, you should configure 3rd party libraries before the `run()` phase of your AngularJS application, so it's recommended that you use the provider or constant mechanism for configuring `ngSegment`. 

However, if your API key or other configuration parameters are only available in the run phase of your application then you can configure using the `segment` service:
```js
angular.module('myApp').controller(function (segment) {

    segment.setKey('abc');
    segment.setCondition(function ($rootScope) {
        return $rootScope.isProduction;
    });
});
```

## Configuration API

The configuration API is available on the `segmentProvider` and `segment` service. For configuring via a constant, see [defaultSegmentConfig](https://github.com/aleross/angular-segment-analytics/blob/master/src/config.js) for the property names to override. 

All configuration methods are chainable:
```js
segmentProvider
    .setKey('xx')
    .setAutoload(false)
    .setDebug(true);
```

### setKey(string)

Sets the API key (or **Write Key**) from your Segment project, found in the setup guide or settings for your project. Your API key is required before Analytics.js can be loaded.

Note: If you don't set the API key during the `.config()` phase of your app (using either the **provider** or **constant** forms of configuration), then ngSegment will not be able to autoload Analytics.js and you'll need to load it manually using `segmentLoader.load(apiKey);`.

### setCondition(injectable callback)
**Default:** none
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

### setAutoload(boolean)
**Default:** `true`

ngSegment autoloads Segment's Analytics.js before the AngularJS `.run()` phase if an API key has been set. Set autoload to false if you're including analytics.js in your build script.

If you need to load the Segment analytics.js script on-demand, you can use the `segmentLoader` or `segmentLoaderProvider`:

```js
angular.module('myApp').controller('MyController', function (segmentLoader) {
    segmentLoader.load('abc');
});
```
If you already set the API key via configuration, you can access it using the segment service:
```js
angular.module('myApp').controller('MyController', function (segmentLoader) {
    segmentLoader.load(segment.config.apiKey);
});
```
or via provider in your application's `config()` block:
```js
angular.module('myApp').config(function (segmentLoaderProvider) {
    segmentLoaderProvider.load('abc');
});
```

### setLoadDelay(integer)
**Default:** `0ms` (no delay)

Used in combination with `setAutoload`, this controls the amount of time in milliseconds ngSegment will wait before autoloading Segment's Analytics.js.

**Why:** If your app loads many resources on page load or asynchronously, and your app doesn't require Segment in the first few seconds of application use, then it could be beneficial to defer loading Segment until other required resources have loaded (scripts, css, fonts, images, etc). Depending on the integrations you've enabled, Segment itself will load a series of additional scripts (e.g. Google Analytics, Intercom). Most browsers limit max connections (across multiple host names) to 17 connections at a time. If you don't hit this limit by the time Analytics.js is autoloaded, then you won't see any benefit from delaying. Note: any events tracked using ngSegment before Analytics.js has loaded will be queued and replayed once Analytics.js has been loaded. If the user leaves or reloads the page before this, then the events will be lost.

If you're using the `segmentLoader` to manually load Analytics.js and still want to introduce a load delay, then instead of `setLoadDelay` you can pass in a delay in milliseconds as the second parameter to `.load()`:

```js
angular.module('myApp').controller('MyController', function (segmentLoader) {

    // Delay loading Analytics.js for 3 seconds
    segmentLoader.load(segment.config.apiKey, 3000);
});
```

### setEvents(object)
**Default:** none

Stores an object on the segment service for easy reference later using `segment.events`.

**Why:** if your app tracks many unique events, it will quickly become unwieldy to keep track of event names if they're hard-coded in your code each time you call `segment.track('Event Name', eventData)`. For better organization, you may want to create an Angular constant to store all events your app uses by name. You can store this constant on the segment service so you don't need to inject your event names constant into every controller/service/etc that uses `segment`.

```js
angular.module('myApp').constant('SegmentEvents', {
    SIGNED_UP: 'Signed Up'
});

angular.module('myApp').config(function (segmentProvider, SegmentEvents) {

    // EventsConstant is a key-value object of events you track
    segmentProvider.setEvents(SegmentEvents);
});

angular.module('myApp').controller('MyController', function (segment) {

    // Easy constant reference later
    segment.track(segment.events.SIGNED_UP, { plan: 'Startup' });
});
```

### setDebug(boolean)
**Default:** `false`

Enables debug log statements that are helpful for troubleshooting or when first setting up Segment and ngSegment.

### setConfig(object)

Convenience method for setting multiple config properties at once using an object that matches the property names of `defaultSegmentConfig`.

```js
angular.module('myApp').config(function (segmentProvider) {

    // Set multiple config properties at once
    segmentProvider.setConfig({
        debug: true,
        apiKey: 'abc',
        autoload: false
    });
});
```


## API Documentation & Examples

The `segment` service and `segmentProvider` implement most methods from [Analytics.js](https://segment.com/docs/libraries/analytics.js/). Check [segmentDefaultConfig.methods](https://github.com/aleross/angular-segment-analytics/blob/master/src/config.js) for a complete list.

### Page tracking
```js
$rootScope.$on('$routeChangeSuccess', function () {
  segment.pageview($location.path());
});
```

### Event tracking
```js
$scope.myAction = function () {
  segment.track();
});
```
