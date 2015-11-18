## requestIdle [![Build Status](https://travis-ci.org/idiotWu/requestIdle.svg?branch=master)](https://travis-ci.org/idiotWu/requestIdle)

[![NPM](https://nodei.co/npm/request-idle.png)](https://nodei.co/npm/request-idle)

**WARNING: this is not a polyfill for `requestIdleCallback`, if you are looking for such thing, try [this one](https://github.com/PixelsCommander/requestIdleCallback-polyfill).**

Allocate time for you task to run!

### Install

```
npm install request-idle --save
```

### Usage

### requestIdle(Number:duration, Function:task)

Allocate time with `duration` parameter, and run given task, eg:

```javascript
requesetIdle(500, function() {
    // task one
    // this will run asap
});

requestIdle(10, function() {
    // task two
    // this will run after task one is finished(about 500ms)
});

```

An `idle` object is passed to task, thus you can release the idle by `idle.end()` before given duration:

```javascript
requesetIdle(500, function(idle) {
    // task one runned about 200ms
    idle.end();
});

requestIdle(10, function() {
    // task two will be invoked after approximate 200ms
});

```

### requestIdle(Function:task)

If first parameter is passed as function, you'll get an idle that is almost endless. **So don't forget to end up the idle when you don't need it any more.**

```javascript
requesetIdle(function(idle) {
    // run you task

    idle.end(); // remember to release
});
```

### requestIdle.release(Boolean:discard)

Release all pending idles, set `discard` to `true` will discard all pending tasks!

### idle#end()

Release current idle.

### idle#add(Number:ms)

Extend current idle duration.

### idle#remain

Get current idle time remaining.

## License

MIT.
