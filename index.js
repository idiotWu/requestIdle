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

    lastTask = lastTask.then(function() {
            var idle = tm.talloc(duration);

            if (typeof task === 'function') task(idle);

            return idle.promise;
        })
        .catch(tm.errorHandler.bind(tm));
};

requestIdle.ignoreError = function() {
    debug = false;
};

module.exports = requestIdle;