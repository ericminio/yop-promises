var path = require('path');
var fs = require('fs');

var load = function(api, file) {
    var line = new Error().stack.split('\n')[2];
    var trace = /\((.*)\)/.exec(line)[1];
    var dirname = trace.substring(0, trace.lastIndexOf(path.sep));
    var filePath = path.join(dirname, file);
    var content = fs.readFileSync(filePath).toString();
    var service = (new Function( content + 'return '+ api +';'))();

    return service;
};

module.exports = load;
