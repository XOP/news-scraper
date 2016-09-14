/* eslint-disable quotes, quote-props */

var path = require('path');
var fs = require('fs-extra');

var test = require('tape');

var renderIndex = require('../dist/render-index.js');

var indexPath = path.resolve(__dirname, 'fixtures/index');
var indexFixture = fs.readFileSync(path.join(indexPath, 'index.fix.html'), 'utf8');

renderIndex(indexPath);

test('Render index test', function (t) {
    var indexTest = fs.readFileSync(path.join(indexPath, 'index.html'), 'utf8');

    t.equal(
        indexTest.trim(),
        indexFixture.trim(),
        'Should render proper index'
    );

    t.end();
});
