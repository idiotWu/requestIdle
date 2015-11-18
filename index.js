'use strict';

var TimeManager = require('./lib/tm');

var lastTask = Promise.resolve();

var debug = true;

function requestIdle() {
    var duration, task;

    if (typeof arguments[0] === 'function') {
        task = arguments[0];
    } else {
        duration = arguments[0];
        task = arguments[1];
    }

    var tm = new TimeManager(debug);
    var currentTask = lastTask;
    var isReleased = false;

    lastTask = currentTask.then(function() {
            if (isReleased) return;

            var idle = tm.talloc(duration);

            if (typeof task === 'function') task(idle);

            return idle.promise;
        })
        .catch(tm.errorHandler.bind(tm));

    lastTask.free = function() {
        if (currentTask.free) currentTask.free();

        tm.free();

        isReleased = true;
    };
};

requestIdle.ignoreError = function() {
    debug = false;
};

requestIdle.release = function() {
    lastTask.free();
};

module.exports = requestIdle;