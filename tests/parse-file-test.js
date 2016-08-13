var fs = require('fs-extra');
var path = require('path');

var test = require('tape');

var parseFile = require('../dist/utils/parse-file.js');

var data;
var dataPath = path.resolve(__dirname, 'fixtures/data');

test('Parse file test', function (t) {

    data = fs.readFileSync(path.join(dataPath, 'data.json'), 'utf8');

    t.deepEqual(
        parseFile(data),

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
        parseFile(data, 'json'),

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
        parseFile(data, 'yml'),

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
        parseFile(data, 'yaml'),

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
        parseFile(data, 'xls'),

        null,

        'Should not parse unknown format'
    );


    t.end();
});
