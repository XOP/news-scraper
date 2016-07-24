var test = require('tape');

var formatFilename = require('../dist/utils/format-file-name.js');

test('Format file name test', function (t) {
    t.equal(
        formatFilename(
            'Test/'
        ),

        'Test/',

        'Should return simple path'
    );

    t.equal(
        formatFilename(
            'Test/',
            'test'
        ),

        'Test/test.html',

        'Should combine path and name'
    );

    t.equal(
        formatFilename(
            'Test/',
            'test',
            '01-01-2000'
        ),

        'Test/test--01-01-2000.html',

        'Should combine path, name and date'
    );

    t.equal(
        formatFilename(
            'Test/',
            '',
            '01-01-2000'
        ),

        'Test/01-01-2000.html',

        'Should combine path and date'
    );

    t.equal(
        formatFilename(
            'Test/',
            'test',
            '01-01-2000',
            'json'
        ),

        'Test/test--01-01-2000.json',

        'Should replace extension'
    );

    t.end();
});
