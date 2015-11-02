module.exports = function Idle(duration) {
    var self = this;
    var timer = undefined;
    var end = duration + Date.now();

    Object.defineProperty(this, 'remain', {
        get() {
            return end - Date.now();
        }
    });

    this.promise = new Promise(function(resolve) {
        timer = setTimeout(resolve, duration);

        self.end = function() {
            resolve();
            clearTimeout(timer);
        };

        self.add = function(ms) {
            ms = parseInt(ms);

            if (isNaN(ms)) throw new TypeError('expect ms to be a number, but got ' + typeof ms);

            clearTimeout(timer);
            end += ms;
            timer = setTimeout(resolve, end - Date.now());
        };
    });
};
