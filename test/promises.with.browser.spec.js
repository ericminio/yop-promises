const Browser = require('zombie');
var browser = new Browser();
var read = function(file) {
    var path = require('path').join(__dirname, file);
    var content = require('fs').readFileSync(path).toString();
    return content;
};

describe('Zombie', function() {

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
                response.write(read('../lib/promises.js'));
            }
            response.end();
        }).listen(port, done);
    });
    afterEach(function() {
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
