'use strict';

var TimeManager = require('./tm');

var lastTask = Promise.resolve();

function requestIdle() {
    var duration, task;

    if (typeof arguments[0] === 'function') {
        task = arguments[0];
    } else {
        duration = arguments[0];
        task = arguments[1];
    }

    var tm = new TimeManager(duration);

    var currentTask = lastTask.then(function() {
            var idle = tm.talloc();

            if (typeof task === 'function') task(idle);

            return idle.promise;
        })
        .catch(tm.errorHandler.bind(tm));

    lastTask = currentTask;

    return currentTask;
};

requestIdle.ignoreError = function() {
    return TimeManager.ignoreError();
};

module.exports = requestIdle;