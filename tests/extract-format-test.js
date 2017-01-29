var test = require('tape');

var extractFormat = require('../dist/server/extract-format.js');

test('Extract format test', function (t) {
    t.equal(
        extractFormat('example.json'),
        'json',
        'Should extract json format from filename'
    );

    t.equal(
        extractFormat('/Users/Documents/username/example.json'),
        'json',
        'Should extract json format from path'
    );

    //t.equal(
    //    extractFormat('/Users/Documents/username/example.xls'),
    //    undefined,
    //    'Should exit process'
    //);
    //
    //t.equal(
    //    extractFormat('/Users/Documents/username/example'),
    //    undefined,
    //    'Should exit process'
    //);

    t.end();
});


