var fs = require('fs-extra');
var path = require('path');

var test = require('tape');

var parseFileData = require('../dist/server/parse-filedata.js');

var data;
var dataPath = path.resolve(__dirname, 'fixtures/data');

test('Parse file test', function (t) {

    data = fs.readFileSync(path.join(dataPath, 'data.json'), 'utf8');

    t.deepEqual(
        parseFileData(data),

        {
            Foo: {
                bar: 'one',
                baz: 'two',
                bam: 'three'
            }
        },

        'Should parse JSON data by default'
    );

    t.deepEqual(
        parseFileData(data, 'json'),

        {
            Foo: {
                bar: 'one',
                baz: 'two',
                bam: 'three'
            }
        },

        'Should parse JSON data'
    );


    data = fs.readFileSync(path.join(dataPath, 'data.yml'), 'utf8');

    t.deepEqual(
        parseFileData(data, 'yml'),

        {
            Foo: {
                bar: 'one',
                baz: 'two',
                bam: 'three'
            }
        },

        'Should parse YAML data with yml format'
    );

    t.deepEqual(
        parseFileData(data, 'yaml'),

        {
            Foo: {
                bar: 'one',
                baz: 'two',
                bam: 'three'
            }
        },

        'Should parse YAML data with yaml format'
    );

    t.equal(
        parseFileData(data, 'xls'),

        null,

        'Should not parse unknown format'
    );


    t.end();
});
