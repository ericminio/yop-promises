var expect = require('chai').expect;
var { Promise, Promises } = require('../lib/promises.js');

describe('Promises chain', function() {

    it('can propagate data', function(success) {
        var p = new Promise();
        p.then(function() {
            return { answer:42 };
        })
        .then(function(data) {
            expect(data).to.deep.equal({ answer:42 });
            success();
        });
        p.resolve();
    });

    it('can propagate promise', function(success) {
        var p = new Promise();
        p.then(function() {
            let secondary = new Promise();
            setTimeout(()=>{ secondary.resolve({ answer:42 }) }, 50);

            return secondary;
        })
        .then(function(data) {
            expect(data).to.deep.equal({ answer:42 });
            success();
        });
        p.resolve();
    });
});
