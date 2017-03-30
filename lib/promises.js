var Promise = function() {
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
};
Promise.prototype.done = function(callback) {
    this.resolveCallbacks.push(callback);
    return this;
};
Promise.prototype.error = function(callback) {
    this.rejectCallbacks.push(callback);
};
Promise.prototype.resolve = function(data) {
    if (this.resolveCallbacks.length > 0) {
        for (var i=0; i<this.resolveCallbacks.length; i++) {
            this.resolveCallbacks[i](data);
        }
    }
};
Promise.prototype.reject = function() {
    if (this.rejectCallbacks.length > 0) {
        for (var i=0; i<this.rejectCallbacks.length; i++) {
            this.rejectCallbacks[i]();
        }
    }
};

var Promises = function() {
    this.promises = [];
};
Promises.prototype.done = function(callback) {
    this.resolveCallback = callback;
};
Promises.prototype.waitFor = function(promise) {
    this.promises.push(promise);
    var self = this;
    promise
    .done(function() {
        self.notifyWhenAllDone(self, promise);
    })
    .error(function() {
        self.notifyWhenAllDone(self, promise);
    });
};
Promises.prototype.notifyWhenAllDone = function(self, promise) {
    self.promises.splice(self.promises.indexOf(promise), 1);
    if (self.promises.length == 0 && self.resolveCallback) {
        self.resolveCallback();
    }
};

(function(root) {
    if (typeof root.module === 'undefined') {
        root.module = {};
    }
})(this);

module.exports = { promise:Promise, promises:Promises };
