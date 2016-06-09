var test = require('tape');

var sourceObjToArray = require('../dist/utils/source-obj-to-array.js');

var source = {
    url1: {
        link: '.link-1',
        title: '.title-1'
    },
    url2: {
        link: '.link-2',
        title: '.title-2'
    }
};

test('Source object conversion test', function (t) {
    t.deepEqual(
        sourceObjToArray(source),
        [
            {
                url: 'url1',
                link: '.link-1',
                title: '.title-1'
            },
            {
                url: 'url2',
                link: '.link-2',
                title: '.title-2'
            }
        ],
        'Should produce collections of objects {url, link, title, ...}'
    );

    t.deepEqual(
        sourceObjToArray(source, [
            {
                url: 'url3',
                link: '.link-3',
                title: '.title-3'
            }
        ]),
        [
            {
                url: 'url3',
                link: '.link-3',
                title: '.title-3'
            },
            {
                url: 'url1',
                link: '.link-1',
                title: '.title-1'
            },
            {
                url: 'url2',
                link: '.link-2',
                title: '.title-2'
            }
        ],
        'Should add items to initial collection'
    );

    t.deepEqual(
        sourceObjToArray(source, [
            {
                url: 'url1',
                link: '.link-1',
                title: '.title-1'
            }
        ]),
        [
            {
                url: 'url1',
                link: '.link-1',
                title: '.title-1'
            },
            {
                url: 'url1',
                link: '.link-1',
                title: '.title-1'
            },
            {
                url: 'url2',
                link: '.link-2',
                title: '.title-2'
            }
        ],
        'Should not overwrite existing items'
    );

    t.end();
});


