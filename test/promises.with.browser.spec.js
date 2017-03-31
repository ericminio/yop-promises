const Browser = require('zombie');
var browser = new Browser();
var fs = require('fs');
var path = require('path');
var istanbul = require('istanbul');
var read = function(file) {
    var filePath = path.join(__dirname, file);
    var content = fs.readFileSync(filePath).toString();
    return content;
};
var instrument = function(file) {
    var global = (Function('return this;'))();
    global['__coverage__'] = {};
    var instrumenter = new istanbul.Instrumenter();
    var code = read(file);
    var instrumented = instrumenter.instrumentSync(code);
    return instrumented;
};
var global = (Function('return this'))();
describe('Promises in browser', function() {

    var app;
    var port = 5000;

    beforeEach(function(done) {
        app = require('http').createServer(function(request, response) {
            if (request.url=='/') {
                response.setHeader('Content-Type', 'text/html');
                response.write(read('./promises.html'));
            }
            else {
                response.setHeader('Content-Type', 'application/javascript');
                response.write(instrument('../lib/promises.js'));
            }
            response.end();
        }).listen(port, done);
    });
    afterEach(function() {
        var code = "" +
            "var global = (Function('return this;'))();" +
            "var report = global['__coverage__'];" +
            "report;";
        var data = browser.evaluate(code);
        var currentFile = __filename;
        var dirname = currentFile.substring(0, currentFile.lastIndexOf(path.sep));
        var filename = currentFile.substring(1+currentFile.lastIndexOf(path.sep));
        var filePath = path.join(dirname, '../coverage', 'coverage.' + filename + '.json');
        fs.writeFileSync(filePath, JSON.stringify(data));
        app.close();
    });

    it('works', function(done) {
        browser.visit('http://localhost:' + port)
        .then(function() {
            browser.assert.text('#status', 'it works');
        })
        .then(done, done);
    });
});
