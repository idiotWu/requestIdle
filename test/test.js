'use strict';

var expect = require('chai').expect;
var requestIdle = require('../index');

requestIdle.ignoreError();

describe('requestIdle tests', function() {
    it('task should be done one by one', function(done) {
        var count = 0;
        var interuptted = false;

        var runTest = function(num) {
            if (interuptted) return;

            try {
                expect(++count).to.equal(num);
            } catch(e) {
                interuptted = true;
                done(e);
            }
        };

        requestIdle(10, function() {
            runTest(1);
        });
        requestIdle(10, function() {
            runTest(2);
        });
        requestIdle(10, function() {
            runTest(3);
        });
        requestIdle(10, function() {
            runTest(4);
        });
        requestIdle(10, function() {
            runTest(5);

            if (!interuptted) done();
        });
    });

    it('task should wait until previous task finished', function(done) {
        var last = Date.now();

        requestIdle(500, function() {
            last = Date.now();
        });

        requestIdle(10, function(idle) {
            var result;

            try {
                expect(Date.now() - last).to.be.at.least(500);
            } catch(e) {
                result = new Error('second task invoked early: ' + e);
            } finally {
                idle.end();
                done(result);
            }
        });
    });

    it('task should be finished when `idle.end()` is called', function(done) {
        var last = Date.now();

        requestIdle(function(idle) {
            last = Date.now();

            setTimeout(function() {
                idle.end();
            }, 500);
        });

        requestIdle(10, function(idle) {
            var result;

            try {
                expect(Date.now() - last).to.be.at.least(500);
            } catch(e) {
                result = new Error('second task invoked early: ' + e);
            } finally {
                idle.end();
                done(result);
            }
        });
    });

    it('task can be finished before given duration', function(done) {
        var last = Date.now();

        requestIdle(500, function(idle) {
            last = Date.now();

            setTimeout(function() {
                idle.end();
            }, 200);
        });

        requestIdle(10, function(idle) {
            var now = Date.now();
            var result;

            try {
                expect(now - last).to.be.at.least(200);
                expect(now - last).to.be.at.most(500);
            } catch(e) {
                result = new Error('second task invoked on wrong time: ' + e);
            } finally {
                idle.end();
                done(result);
            }
        });
    });

    it('`idle.remain` should return correct remaining', function(done) {
        requestIdle(1000, function(idle) {
            setTimeout(function() {
                var result;

                try {
                    expect(idle.remain).to.be.within(790, 810);
                } catch(e) {
                    result = e;
                } finally {
                    idle.end();
                    done(result);
                }
            }, 200);
        });
    });

    it('idle should be increased by 200ms', function(done) {
        var last = Date.now();

        requestIdle(0, function(idle) {
            idle.add(200);
        });

        requestIdle(function(idle) {
            var result;

            try {
                expect(Date.now() - last).to.at.least(200);
            } catch(e) {
                result = e;
            }

            idle.end();
            done(result);
        });
    });

    it('error should not break task list', function(done) {
        requestIdle(10, function() {
            throw new Error('error');
        });

        requestIdle(10, function() {
            done();
        });
    });

    it('last task should be released', function(done) {
        var last = Date.now();

        requestIdle(1000);

        requestIdle.release();
        requestIdle(10, function() {
            var result;

            try {
                expect(Date.now() - last).to.be.below(1000);
            } catch(e) {
                result = e;
            }

            done(result);
        });
    });
});