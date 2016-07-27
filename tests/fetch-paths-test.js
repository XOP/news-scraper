var path = require('path');

var test = require('tape');

var fetchPaths = require('../dist/fetch-paths.js');


var pathRoot = path.resolve(__dirname, 'fixtures/paths');

var localSingle = [
    path.join(pathRoot, '1.yml')
];
var localMulti = [
    path.join(pathRoot, '1.yml'),
    path.join(pathRoot, '2.yml')
];

//var repoSingle = [
//    path.join(pathRoot, '3.yml')
//];
//var repoMulti = [
//    path.join(pathRoot, '3.yml'),
//    path.join(pathRoot, '4.yml')
//];

test('Format file name test', function (t) {

    fetchPaths(localSingle).then(function (data) {
        t.deepEqual(
            data,
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
    }).catch(function (err) {
        console.error(err);
    });

    fetchPaths(localMulti).then(function (data) {
        t.deepEqual(
            data,
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
    }).catch(function (err) {
        console.error(err);
    });

    // todo: local + repo tests

    t.end();
});
