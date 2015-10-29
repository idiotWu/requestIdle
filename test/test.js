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

        requestIdle(10, function() {
            try {
                expect(Date.now() - last).to.be.above(500);
            } catch(e) {
                return done(new Error('second task invoked early: ' + e));
            }

            done();
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

        requestIdle(10, function() {
            try {
                expect(Date.now() - last).to.be.above(500);
            } catch(e) {
                return done(new Error('second task invoked early: ' + e));
            }

            done();
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

        requestIdle(10, function() {
            var now = Date.now();

            try {
                expect(now - last).to.be.above(200);
                expect(now - last).to.be.below(500);
            } catch(e) {
                return done(new Error('second task invoked on wrong time: ' + e));
            }

            done();
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
});