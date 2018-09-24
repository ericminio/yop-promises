var Promise = function() {
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
};
Promise.prototype.done = function(callback) {
    return this.then(callback);
};
Promise.prototype.then = function(callback) {
    this.resolveCallbacks.push(callback);
    return this;
};
Promise.prototype.catch = function(callback) {
    this.rejectCallbacks.push(callback);
};
Promise.prototype.resolve = function(data) {
    let ps = new Promises();
    ps.done((current)=>{
        if (current.index < this.resolveCallbacks.length) {
            try {
                let value = this.resolveCallbacks[current.index](current.data);
                if (value instanceof Promise) {
                    value.done((data)=>{
                        ps.resolveCallback({ data:data, index:current.index+1 });
                    }).catch((error)=>{
                        this.reject(error);
                    })
                } else {
                    ps.resolveCallback({ data:value, index:current.index+1 });
                }
            }
            catch (error) { this.reject(error); }
        }
    });
    ps.resolveCallback({ data:data, index:0 });
};
Promise.prototype.reject = function(data) {
    if (this.rejectCallbacks.length > 0) {
        for (var i=0; i<this.rejectCallbacks.length; i++) {
            this.rejectCallbacks[i](data);
        }
    }
};

var Promises = function() {
    this.promises = [];
};
Promises.prototype.done = function(callback) {
    this.resolveCallback = callback;
};
Promises.prototype.then = function(callback) {
    this.done(callback);
};
Promises.prototype.waitFor = function(promise) {
    this.promises.push(promise);
    promise
    .done((data)=> {
        this.notifyWhenAllDone(promise, data);
    })
    .catch(()=> {
        this.notifyWhenAllDone(promise);
    });
};
Promises.prototype.notifyWhenAllDone = function(promise, data) {
    this.promises.splice(this.promises.indexOf(promise), 1);
    if (this.promises.length == 0 && this.resolveCallback) {
        this.resolveCallback(data);
    }
};

(function() {
    if (typeof module == 'object') {
        module.exports = {
            promise:Promise,
            promises:Promises,
            Promise:Promise,
            Promises:Promises
        };
    }
})();
