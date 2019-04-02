const { expect } = require('chai')
const { Promise, Promises } = require('../lib/promises.js');

describe('Promise with await', function() {

    it('allows sync treatment', async ()=> {
        let p = new Promise()
        setTimeout(()=>{ p.resolve(42) }, 300)
        let value = await p

        expect(value).to.equal(42)
    })

    it('handles collection', async ()=>{
        let p1 = new Promise()
        let p2 = new Promise()
        let ps = new Promises()
        ps.waitFor(p1)
        ps.waitFor(p2)
        setTimeout(()=>{ p1.resolve(11) }, 300)
        setTimeout(()=>{ p2.resolve(12) }, 300)
        let value = await ps

        expect(value).to.deep.equal([11, 12])
    })
});
