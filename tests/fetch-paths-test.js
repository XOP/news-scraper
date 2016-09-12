var path = require('path');

var test = require('tape');

var fetchPaths = require('../dist/fetch-paths.js');


var pathRoot = path.resolve(__dirname, 'fixtures/paths');

var localSingle = [
    path.join(pathRoot, 'first.yml')
];
var localMulti = [
    path.join(pathRoot, 'first.yml'),
    path.join(pathRoot, 'second.yml')
];

var repoSingle = [
    path.join(pathRoot, 'third.yml')
];
var repoMulti = [
    path.join(pathRoot, 'third.yml'),
    path.join(pathRoot, 'last.yml')
];

test('Fetch paths test', function (t) {

    //
    // local
    t.deepEqual(
        fetchPaths(localSingle),
        {
            '1-1': {
                url: '#1-1',
                elem: 'a.1-1'
            },
            '1-2': {
                url: '#1-2',
                elem: 'a.1-2'
            },
            '1-3': {
                url: '#1-3',
                elem: 'a.1-3'
            }
        },

        'Should parse 1 local file'
    );

    t.deepEqual(
        fetchPaths(localMulti),
        {
            '1-1': {
                url: '#1-1',
                elem: 'a.1-1'
            },
            '1-2': {
                url: '#1-2',
                elem: 'a.1-2'
            },
            '1-3': {
                url: '#1-3',
                elem: 'a.1-3'
            },
            '2-1': {
                url: '#2-1',
                elem: 'a.2-1'
            },
            '2-2': {
                url: '#2-2',
                elem: 'a.2-2'
            }
        },

        'Should parse multi local files'
    );

    //
    // local + repo

    t.deepEqual(
        fetchPaths(localSingle, repoSingle),
        {
            '3-1': {
                url: '#3-1',
                elem: 'a.3-1'
            },
            '3-2': {
                url: '#3-2',
                elem: 'a.3-2'
            },
            '3-3': {
                url: '#3-3',
                elem: 'a.3-3'
            },
            '1-1': {
                url: '#1-1',
                elem: 'a.1-1'
            },
            '1-2': {
                url: '#1-2',
                elem: 'a.1-2'
            },
            '1-3': {
                url: '#1-3',
                elem: 'a.1-3'
            }
        },

        'Should parse 1 local file and 1 repo file'
    );

    t.deepEqual(
        fetchPaths(localMulti, repoMulti),
        {
            '3-1': {
                url: '#3-1',
                elem: 'a.3-1'
            },
            '3-2': {
                url: '#3-2',
                elem: 'a.3-2'
            },
            '3-3': {
                url: '#3-3',
                elem: 'a.3-3'
            },
            '4-1': {
                url: '#4-1',
                elem: 'a.4-1'
            },
            '4-2': {
                url: '#4-2',
                elem: 'a.4-2'
            },
            '1-1': {
                url: '#1-1',
                elem: 'a.1-1'
            },
            '1-2': {
                url: '#1-2',
                elem: 'a.1-2'
            },
            '1-3': {
                url: '#1-3',
                elem: 'a.1-3'
            },
            '2-1': {
                url: '#2-1',
                elem: 'a.2-1'
            },
            '2-2': {
                url: '#2-2',
                elem: 'a.2-2'
            }
        },

        'Should parse multi local and repo files'
    );

    t.end();
});
