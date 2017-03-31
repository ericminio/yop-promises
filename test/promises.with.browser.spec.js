var coverage = require('./yop-zombie-istanbul.js');
const Browser = require('zombie');
var browser = new Browser();
var fs = require('fs');
var path = require('path');

describe('Promises in browser', function() {

    var app;
    var port = 5000;

    beforeEach(function(done) {
        app = require('http').createServer(function(request, response) {
            if (request.url=='/') {
                response.setHeader('Content-Type', 'text/html');
                var filePath = path.join(__dirname, './promises.html');
                var content = fs.readFileSync(filePath).toString();
                response.write(content);
            }
            else {
                response.setHeader('Content-Type', 'application/javascript');
                response.write(coverage.instrument('../lib/promises.js'));
            }
            response.end();
        }).listen(port, done);
    });
    afterEach(function() {
        coverage.save(browser);
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
