/* eslint-disable quotes, quote-props */

var test = require('tape');

var filterData = require('../dist/filter-data.js');

var currentData;
var newData;

test('Filtering data test', function (t) {
    //
    // new object

    currentData = [
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
        }
    ];

    newData = [
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
    ];

    t.deepEqual(
        filterData(newData, currentData),
        newData,

        'Should simply return whole new object'
    );

    //
    // new items in data collection

    currentData = [
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
        }
    ];

    newData = [
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
                },
                {
                    "href": "#1-3",
                    "title": "",
                    "text": "Link 1-3",
                    "raw": "<a href=\"#1-3\">Link 1-3</a>"
                }
            ]
        }
    ];

    t.deepEqual(
        filterData(newData, currentData),

        [
            {
                "title": "Title 1",
                "data": [
                    {
                        "href": "#1-3",
                        "title": "",
                        "text": "Link 1-3",
                        "raw": "<a href=\"#1-3\">Link 1-3</a>"
                    }
                ]
            }
        ],

        'Should return new items in data collection'
    );

    //
    // new page in data collection

    currentData = [
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
        }
    ];

    newData = [
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
                }
            ]
        }
    ];

    t.deepEqual(
        filterData(newData, currentData),

        [
            {
                "title": "Title 2",
                "data": [
                    {
                        "href": "#2-1",
                        "title": "",
                        "text": "Link 2-1",
                        "raw": "<a href=\"#2-1\">Link 2-1</a>"
                    }
                ]
            }
        ],

        'Should return new page in data collection'
    );

    //
    // new items in 2 pages in data collection

    currentData = [
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
                }
            ]
        }
    ];

    newData = [
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
                },
                {
                    "href": "#1-3",
                    "title": "",
                    "text": "Link 1-3",
                    "raw": "<a href=\"#1-3\">Link 1-3</a>"
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
    ];

    t.deepEqual(
        filterData(newData, currentData),

        [
            {
                "title": "Title 1",
                "data": [
                    {
                        "href": "#1-3",
                        "title": "",
                        "text": "Link 1-3",
                        "raw": "<a href=\"#1-3\">Link 1-3</a>"
                    }
                ]
            },
            {
                "title": "Title 2",
                "data": [
                    {
                        "href": "#2-2",
                        "title": "",
                        "text": "Link 2-2",
                        "raw": "<a href=\"#2-2\">Link 2-2</a>"
                    }
                ]
            }
        ],

        'Should return new page in data collection'
    );

    //
    // no new items

    currentData = [
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
        }
    ];

    newData = [
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
        }
    ];

    t.deepEqual(
        filterData(newData, currentData),
        null,

        'Should return null if no new items detected'
    );

    t.end();
});
