var Idle = require('./idle');

function TimeManager(debug) {
    this.debug = !!debug;
};

TimeManager.prototype.talloc = function(duration) {
    duration = parseInt(duration);

    duration = isNaN(duration) ? -1 >>> 1 : duration;

    var idle = this.idle = new Idle(duration);

    return idle;
};

TimeManager.prototype.free = function() {
    this.idle.end();
};

TimeManager.prototype.errorHandler = function(err) {
    this.free();

    if (this.debug) {
        console.error(err);
    }
};

module.exports = TimeManager;