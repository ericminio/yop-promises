var expect = require('chai').expect;
var { Promise, Promises } = require('../lib/promises.js');

describe('Promise', function() {

    it('allows deferred treatment', function(success) {
        var p = new Promise();
        p.done(function() {
            success();
        });
        p.resolve();
    });
    it('propagates data', function(success) {
        var p = new Promise();
        p.done(function(data) {
            expect(data).to.deep.equal({ answer:42 });
            success();
        });
        p.resolve({ answer:42 });
    });
    it('allows deferred error', function(success) {
        var p = new Promise();
        p
        .done(function() {
        })
        .catch(function() {
            success();
        });
        p.reject();
    });
    it('propagates error on error', function(success) {
        var p = new Promise();
        p
        .done(function() {
        })
        .catch(function(error) {
            expect(error).to.deep.equal({ answer:33 });
            success();
        });
        p.reject({ answer:33} );
    });
    it('supports no resolve callback', function() {
        var p = new Promise();
        p.resolve();
    });
    it('supports no reject callback', function() {
        var p = new Promise();
        p.reject();
    });

    describe('collection', function() {

        it('waits for all promises to be resolved', function(success) {
            var p1 = new Promise();
            var p2 = new Promise();

            var ps = new Promises();
            ps.done(function() {
                expect(ps.promises).to.deep.equal([]);
                success();
            });
            ps.waitFor(p1);
            ps.waitFor(p2);
            p1.resolve();
            p2.resolve();
        });
        it('keeps callbacks previously registered in promises', function(done) {
            var p = new Promise();
            p.done(function() {
                done();
            });
            var ps = new Promises();
            ps.waitFor(p);
            p.resolve();
        });
        it('waits for all promises to be resolved or rejected', function(done) {
            var p1 = new Promise();
            var p2 = new Promise();

            var ps = new Promises();
            ps.done(function() {
                expect(ps.promises).to.deep.equal([]);
                done();
            });
            ps.waitFor(p1);
            ps.waitFor(p2);
            p1.resolve();
            p2.reject();
        });
        it('supports full rejection', function(success) {
            var p1 = new Promise();
            var p2 = new Promise();

            var ps = new Promises();
            ps.done(function() {
                expect(ps.promises).to.deep.equal([]);
                success();
            });
            ps.waitFor(p1);
            ps.waitFor(p2);
            p1.reject();
            p2.reject();
        });
        it('keeps rejection callbacks previously registered in promises', function(done) {
            var p = new Promise();
            p.catch(function() {
                done();
            });
            var ps = new Promises();
            ps.waitFor(p);
            p.reject();
        });
        it('supports no resolve callback', function() {
            var ps = new Promises();
            var p = new Promise();
            ps.waitFor(p);
            p.resolve();
        });
    });
});
