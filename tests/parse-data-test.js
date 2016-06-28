var test = require('tape');

var parseData = require('../dist/parse-data.js');

var scrapedData = [
    {
        title: 'Title 1',
        data: [
            '<a href="#1-1">Link 1-1</a>',
            '<a href="#1-2">Link 1-2</a>'
        ]
    },
    {
        title: 'Title 2',
        data: [
            '<a href="#2-1">Link 2-1</a>',
            '<a href="#2-2">Link 2-2</a>'
        ]
    }
];

test('Source object conversion test', function (t) {
    t.deepEqual(
        parseData(scrapedData),

        '<section>' +
        '<h2>Title 1</h2>' +
        '<article><a href="#1-1">Link 1-1</a><a href="#1-2">Link 1-2</a></article>' +
        '</section>' +
        '<section>' +
        '<h2>Title 2</h2>' +
        '<article><a href="#2-1">Link 2-1</a><a href="#2-2">Link 2-2</a></article>' +
        '</section>',

        'Should return HTML'
    );

    t.end();
});


