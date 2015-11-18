'use strict';

var TimeManager = require('./lib/tm');

var currentTask = Promise.resolve();

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
    var lastTask = currentTask;
    var isReleased = false;
    var discardTask = false;

    currentTask = lastTask.then(function() {
            task = typeof task === 'function' && task;

            var idle = tm.talloc(duration);

            if (isReleased) {
                if (!discardTask && task) task(idle);
                return;
            }

            if (task) task(idle);

            return idle.promise;
        })
        .catch(tm.errorHandler.bind(tm));

    currentTask.end = function(discard) {
        isReleased = true;
        discardTask = discard;

        if (lastTask.end) lastTask.end(discard);

        tm.free();
    };
};

requestIdle.ignoreError = function() {
    debug = false;
};

requestIdle.release = function(discard) {
    currentTask.end(discard);
};

module.exports = requestIdle;