/* eslint-disable quotes, quote-props */

var test = require('tape');

var refineData = require('../dist/refine-data.js');

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

test('Source object refinement test', function (t) {
    t.deepEqual(
        refineData(scrapedData),

        [
            {
                "title": "Title 1",
                "data": [
                    {
                        "href": "#1-1",
                        "title": "",
                        "text": "Link 1-1",
                        "raw": "<a href=\"#1-1\">Link 1-1</a>"
                    },
                    {
                        "href": "#1-2",
                        "title": "",
                        "text": "Link 1-2",
                        "raw": "<a href=\"#1-2\">Link 1-2</a>"
                    }
                ]
            },
            {
                "title": "Title 2",
                "data": [
                    {
                        "href": "#2-1",
                        "title": "",
                        "text": "Link 2-1",
                        "raw": "<a href=\"#2-1\">Link 2-1</a>"
                    },
                    {
                        "href": "#2-2",
                        "title": "",
                        "text": "Link 2-2",
                        "raw": "<a href=\"#2-2\">Link 2-2</a>"
                    }
                ]
            }
        ],

        'Should refine sections'
    );

    t.end();
});
