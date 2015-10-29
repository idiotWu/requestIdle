function Idle() {
    var self = this;

    this.promise = new Promise(function(resolve) {
        self.end = resolve;
    });
};

function TimeManager(duration) {
    duration = parseInt(duration);

    this.duration = isNaN(duration) ? -1 >>> 1 : duration;
};

TimeManager.prototype.talloc = function() {
    var idle = new Idle();

    this.timer = setTimeout(idle.end.bind(idle), this.duration);

    return idle;
};

TimeManager.prototype.free = function() {
    clearTimeout(this.timer);
};

TimeManager.prototype.errorHandler = function(err) {
    console.error(err);
    this.free();
};

module.exports = TimeManager;