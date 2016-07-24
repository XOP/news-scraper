/* eslint-disable quotes, quote-props */

var path = require('path');
var fs = require('fs-extra');

var test = require('tape');

var log = require('log-util');
var renderIndex = require('../dist/render-index.js');

var indexPath = path.resolve(__dirname, 'fixtures/index');
var indexFixture = fs.readFileSync(path.join(indexPath, 'index.fix.html'), 'utf8');

test('Render index test', function (t) {

    renderIndex(indexPath)
        .then(function () {
            var indexTest = fs.readFileSync(path.join(indexPath, 'index.html'), 'utf8');

            t.equal(
                indexTest.trim(),
                indexFixture.trim(),
                'Should render proper index'
            );
        })
        .catch(function (err) {
            log.error(err);
        });

    t.end();
});
