var fs = require('fs');
var path = require('path');
var istanbul = require('istanbul');

var extended = {

    locations: function() {
        var line = new Error().stack.split('\n')[3];
        var specFile = /\((.*)\)/.exec(line)[1];
        var specDir = specFile.substring(0, specFile.lastIndexOf(path.sep));
        var specFilename = specFile.substring(1+specFile.lastIndexOf(path.sep));
        specFilename = specFilename.substring(0, specFilename.indexOf(':'));

        return {
            specFile: specFile,
            specDir: specDir,
            specFilename: specFilename
        };
    },

    instrument: function(file) {
        this.file = file;
        var global = (Function('return this;'))();
        global['__coverage__'] = {};
        var instrumenter = new istanbul.Instrumenter();
        var filePath = path.join(this.locations().specDir, file);
        var code = fs.readFileSync(filePath).toString();
        var instrumented = instrumenter.instrumentSync(code);

        return instrumented;
    },

    save: function(browser) {
        var code = "" +
            "var global = (Function('return this;'))();" +
            "var report = global['__coverage__'];" +
            "report;";
        var data = browser.evaluate(code);

        var wrongName = Object.keys(data)[0];
        var correctName = path.join(this.locations().specDir, this.file);
        correctName = correctName.split("\\").join("\\\\");
        var content = JSON.stringify(data).split(wrongName).join(correctName);

        var filePath = path.join('./coverage', 'coverage.' + this.locations().specFilename + '.json');
        fs.writeFileSync(filePath, content);
    }
};

module.exports = extended;
