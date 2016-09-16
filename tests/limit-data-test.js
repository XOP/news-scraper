var test = require('tape');

var limitData = require('../dist/scraper/limit-data.js');

var scrapedData = [];

test('Source object limit links test', function (t) {
    //
    // default limit

    scrapedData = [
        {
            title: 'Title 1',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>',
                '<a href="#1-3">Link 1-2</a>',
                '<a href="#1-4">Link 1-2</a>'
            ]
        }
    ];

    t.deepEqual(
        limitData(scrapedData, 3),

        [
            {
                title: 'Title 1',
                data: [
                    '<a href="#1-1">Link 1-1</a>',
                    '<a href="#1-2">Link 1-2</a>',
                    '<a href="#1-3">Link 1-2</a>'
                ]
            }
        ],

        'Should return limited links using config setting'
    );

    //
    // individual limit

    scrapedData = [
        {
            title: 'Title 1',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>',
                '<a href="#1-3">Link 1-2</a>',
                '<a href="#1-4">Link 1-2</a>'
            ],
            limit: 2
        }
    ];

    t.deepEqual(
        limitData(scrapedData, 3),

        [
            {
                title: 'Title 1',
                data: [
                    '<a href="#1-1">Link 1-1</a>',
                    '<a href="#1-2">Link 1-2</a>'
                ],
                limit: 2
            }
        ],

        'Should return limited links using individual setting'
    );

    //
    // no limit

    scrapedData = [
        {
            title: 'Title 1',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>',
                '<a href="#1-3">Link 1-2</a>',
                '<a href="#1-4">Link 1-2</a>'
            ]
        }
    ];

    t.deepEqual(
        limitData(scrapedData),
        scrapedData,

        'Should return same object if no limit provided'
    );

    //
    // limit is higher

    scrapedData = [
        {
            title: 'Title 1',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>',
                '<a href="#1-3">Link 1-2</a>',
                '<a href="#1-4">Link 1-2</a>'
            ]
        }
    ];

    t.deepEqual(
        limitData(scrapedData, 5),
        scrapedData,

        'Should return same object if limit is higher than links amount'
    );

    t.end();
});
