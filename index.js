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
    var discardTask = false;

    lastTask = currentTask.then(function() {
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

    lastTask.end = function(discard) {
        isReleased = true;
        discardTask = discard;

        if (currentTask.end) currentTask.end(discard);

        tm.free();
    };
};

requestIdle.ignoreError = function() {
    debug = false;
};

requestIdle.release = function(discard) {
    lastTask.end(discard);
};

module.exports = requestIdle;