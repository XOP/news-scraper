/* eslint-disable quotes, quote-props */

var test = require('tape');

var refineData = require('../dist/scraper/refine-data.js');

var scrapedData = [];

test('Source object refinement test', function (t) {
    scrapedData = [
        {
            title: 'Title 1',
            url: '',
            data: [
                '<a href="#1-1">' +
                    'Link 1-1' +
                '</a>',

                '<a href="#1-2">' +
                    'Link 1-2' +
                '</a>'
            ]
        },
        {
            title: 'Title 2',
            url: '',
            data: [
                '<a href="#2-1">' +
                    'Link 2-1' +
                '</a>',

                '<a href="#2-2">' +
                    'Link 2-2' +
                '</a>'
            ]
        }
    ];

    t.deepEqual(
        refineData(scrapedData).pages,

        [
            {
                title: 'Title 1',
                url: '',
                data: [
                    {
                        href: '#1-1',
                        text: 'Link 1-1',
                        title: '',
                        raw: '' +
                            '<a href="#1-1">' +
                                'Link 1-1' +
                            '</a>'
                    },
                    {
                        href: '#1-2',
                        text: 'Link 1-2',
                        title: '',
                        raw: '' +
                            '<a href="#1-2">' +
                                'Link 1-2' +
                            '</a>'
                    }
                ]
            },
            {
                title: 'Title 2',
                url: '',
                data: [
                    {
                        href: '#2-1',
                        text: 'Link 2-1',
                        title: '',
                        raw: '' +
                            '<a href="#2-1">' +
                                'Link 2-1' +
                            '</a>'
                    },
                    {
                        href: '#2-2',
                        text: 'Link 2-2',
                        title: '',
                        raw: '' +
                            '<a href="#2-2">' +
                                'Link 2-2' +
                            '</a>'
                    }
                ]
            }
        ],

        'Should refine defaults with minimum options, link is separated'
    );


    scrapedData = [
        {
            title: 'Title 1',
            url: '',
            elem: 'article',
            link: 'a',
            author: 'span',
            time: 'time',
            image: 'img',
            data: [
                '<article>' +
                    '<a href="#1-1">Link 1-1</a>' +
                    '<span>Author 1</span>' +
                    '<time>28.02.2016</time>' +
                    '<img src="image-1.jpg"/>' +
                '</article>',

                '<article>' +
                    '<a href="#1-2">Link 1-2</a>' +
                    '<span>Author 2</span>' +
                    '<time>29.02.2016</time>' +
                    '<img src="image-2.jpg"/>' +
                '</article>'
            ]
        }
    ];

    t.deepEqual(
        refineData(scrapedData).pages,

        [
            {
                title: 'Title 1',
                url: '',
                elem: 'article',
                link: 'a',
                author: 'span',
                time: 'time',
                image: 'img',
                data: [
                    {
                        author: 'Author 1',
                        href: '#1-1',
                        imageSrc: 'image-1.jpg',
                        text: 'Link 1-1',
                        time: '28.02.2016',
                        title: '',
                        raw: '' +
                            '<article>' +
                                '<a href="#1-1">Link 1-1</a>' +
                                '<span>Author 1</span>' +
                                '<time>28.02.2016</time>' +
                                '<img src="image-1.jpg"/>' +
                            '</article>'
                    },
                    {
                        author: 'Author 2',
                        href: '#1-2',
                        imageSrc: 'image-2.jpg',
                        text: 'Link 1-2',
                        time: '29.02.2016',
                        title: '',
                        raw: '' +
                            '<article>' +
                                '<a href="#1-2">Link 1-2</a>' +
                                '<span>Author 2</span>' +
                                '<time>29.02.2016</time>' +
                                '<img src="image-2.jpg"/>' +
                            '</article>'
                    }
                ]
            }
        ],

        'Should refine all properties, link is separated'
    );


    /*

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

    */

    t.end();
});
