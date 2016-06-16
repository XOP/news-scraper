var test = require('tape');

var sourceObjToArray = require('../dist/utils/source-obj-to-array.js');

var source = {
    title1: {
        url: 'url-1',
        elem: '.elem-1'
    },
    title2: {
        url: 'url-2',
        elem: '.elem-2'
    }
};

test('Source object conversion test', function (t) {
    t.deepEqual(
        sourceObjToArray(source),
        [
            {
                url: 'url-1',
                elem: '.elem-1',
                title: 'title1'
            },
            {
                url: 'url-2',
                elem: '.elem-2',
                title: 'title2'
            }
        ],
        'Should produce collections of objects {url, elem, title, ...}'
    );

    t.deepEqual(
        sourceObjToArray(source, [
            {
                url: 'url-3',
                elem: '.elem-3',
                title: 'title3'
            }
        ]),
        [
            {
                url: 'url-3',
                elem: '.elem-3',
                title: 'title3'
            },
            {
                url: 'url-1',
                elem: '.elem-1',
                title: 'title1'
            },
            {
                url: 'url-2',
                elem: '.elem-2',
                title: 'title2'
            }
        ],
        'Should add items to initial collection'
    );

    t.deepEqual(
        sourceObjToArray(source, [
            {
                url: 'url-1',
                elem: '.elem-1',
                title: 'title1'
            }
        ]),
        [
            {
                url: 'url-1',
                elem: '.elem-1',
                title: 'title1'
            },
            {
                url: 'url-1',
                elem: '.elem-1',
                title: 'title1'
            },
            {
                url: 'url-2',
                elem: '.elem-2',
                title: 'title2'
            }
        ],
        'Should not overwrite existing items'
    );

    t.end();
});


