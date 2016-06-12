// TODO: FIX TEST

var test = require('tape');

var parseData = require('../dist/parse-data.js');

var scrapedData = [
    '<a href="#1">Link 1</a>',
    '<a href="#2">Link 2</a>',
    [
        '<a href="#3-1">Link 3-1</a>',
        '<a href="#3-2">Link 3-2</a>',
        '<a href="#3-3">Link 3-3</a>'
    ]
];

test('Source object conversion test', function (t) {
    t.deepEqual(
        parseData(scrapedData),

        '<a href="#1">Link 1</a><br/>' +
        '<a href="#2">Link 2</a><br/>' +
        '<a href="#3-1">Link 3-1</a>',

        'Should return HTML'
    );

    t.end();
});


