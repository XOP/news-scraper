/* eslint-disable quotes, quote-props */

var test = require('tape');

var refineData = require('../dist/refine-data.js');

var scrapedData = [];

test('Source object refinement test', function (t) {
    scrapedData = [
        {
            title: 'Title 1',
            url: '',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>'
            ]
        },
        {
            title: 'Title 2',
            url: '',
            data: [
                '<a href="#2-1">Link 2-1</a>',
                '<a href="#2-2">Link 2-2</a>'
            ]
        }
    ];

    t.deepEqual(
        refineData(scrapedData),

        [
            {
                "title": "Title 1",
                "url": "",
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
                "url": "",
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


    scrapedData = [
        {
            title: 'Title 1',
            url: 'http://scraper.com',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="/1-2">Link 1-2</a>'
            ]
        }
    ];

    t.deepEqual(
        refineData(scrapedData),

        [
            {
                "title": "Title 1",
                "url": "http://scraper.com",
                "data": [
                    {
                        "href": "http://scraper.com#1-1",
                        "title": "",
                        "text": "Link 1-1",
                        "raw": "<a href=\"#1-1\">Link 1-1</a>"
                    },
                    {
                        "href": "http://scraper.com/1-2",
                        "title": "",
                        "text": "Link 1-2",
                        "raw": "<a href=\"/1-2\">Link 1-2</a>"
                    }
                ]
            }
        ],

        'Should convert relative links to absolute'
    );


    scrapedData = [
        {
            title: 'Title 1',
            url: 'http://scraper.com/blog/',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="/1-2">Link 1-2</a>'
            ]
        }
    ];

    t.deepEqual(
        refineData(scrapedData),

        [
            {
                "title": "Title 1",
                "url": "http://scraper.com/blog/",
                "data": [
                    {
                        "href": "http://scraper.com#1-1",
                        "title": "",
                        "text": "Link 1-1",
                        "raw": "<a href=\"#1-1\">Link 1-1</a>"
                    },
                    {
                        "href": "http://scraper.com/1-2",
                        "title": "",
                        "text": "Link 1-2",
                        "raw": "<a href=\"/1-2\">Link 1-2</a>"
                    }
                ]
            }
        ],

        'Should convert relative links to absolute'
    );

    t.end();
});
