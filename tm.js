'use strict';

var ignoreError = false;

function Idle(tm) {
    var self = this;

    this.promise = new Promise(function(resolve) {
        self.end = function(v) {
            resolve(v);
            tm.free();
        };
    });
};

function TimeManager(duration) {
    duration = parseInt(duration);

    this.duration = isNaN(duration) ? -1 >>> 1 : duration;
};

TimeManager.prototype.talloc = function() {
    var idle = new Idle(this);

    this.timer = setTimeout(idle.end.bind(idle), this.duration);

    return idle;
};

TimeManager.prototype.free = function() {
    clearTimeout(this.timer);
};

TimeManager.prototype.errorHandler = function(err) {
    this.free();

    if (!ignoreError) {
        console.error(err);
    }
};

TimeManager.ignoreError = function() {
    ignoreError = true;
};

module.exports = TimeManager;