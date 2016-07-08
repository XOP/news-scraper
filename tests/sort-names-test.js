/* eslint-disable quotes, quote-props */

var test = require('tape');

var sortNames = require('../dist/utils/sort-names.js');

var names = [];

test('Sort names', function (t) {
    names = [
        '01-07-2016@200.html',
        '01-07-2016@300.html',
        '01-07-2016@100.html'
    ];

    t.deepEqual(
        sortNames(names),

        [
            '01-07-2016@300.html',
            '01-07-2016@200.html',
            '01-07-2016@100.html'
        ],

        'Should sort names with the same pre-divider value'
    );

    t.end();
});
