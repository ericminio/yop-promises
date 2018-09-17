var Promise = function() {
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
};
Promise.prototype.done = function(callback) {
    this.resolveCallbacks.push(callback);
    return this;
};
Promise.prototype.then = function(callback) {
    return this.done(callback);
};
Promise.prototype.catch = function(callback) {
    this.rejectCallbacks.push(callback);
};
Promise.prototype.resolve = function(data) {
    if (this.resolveCallbacks.length > 0) {
        for (var i=0; i<this.resolveCallbacks.length; i++) {
            this.resolveCallbacks[i](data);
        }
    }
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
    var self = this;
    promise
    .done(function() {
        self.notifyWhenAllDone(self, promise);
    })
    .catch(function() {
        self.notifyWhenAllDone(self, promise);
    });
};
Promises.prototype.notifyWhenAllDone = function(self, promise) {
    self.promises.splice(self.promises.indexOf(promise), 1);
    if (self.promises.length == 0 && self.resolveCallback) {
        self.resolveCallback();
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
