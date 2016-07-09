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

    //
    //

    names = [
        '01-07-2016@200.html',
        '01-07-2016@300.html',
        '01-07-2016@100.html',
        '02-07-2016@400.html',
        '02-07-2016@500.html'
    ];

    t.deepEqual(
        sortNames(names),

        [
            '02-07-2016@500.html',
            '02-07-2016@400.html',
            '01-07-2016@300.html',
            '01-07-2016@200.html',
            '01-07-2016@100.html'
        ],

        'Should sort names with different pre-divider values'
    );

    //
    //

    names = [
        '01-07-2016---200.html',
        '01-07-2016---300.html',
        '01-07-2016---100.html',
        '02-07-2016---400.html',
        '02-07-2016---500.html'
    ];

    t.deepEqual(
        sortNames(names, true, '---'),

        [
            '02-07-2016---500.html',
            '02-07-2016---400.html',
            '01-07-2016---300.html',
            '01-07-2016---200.html',
            '01-07-2016---100.html'
        ],

        'Should also work with different divider value'
    );

    //
    //

    names = [
        '01-07-2016@200.html',
        '01-07-2016@300.html',
        '01-07-2016@100.html',
        '02-07-2016@400.html',
        '07-09-2016@900.html',
        '02-07-2015@50.html',
        '09-07-2016@800.html',
        '23-11-2016@1000.html'
    ];

    t.deepEqual(
        sortNames(names),

        [
            '23-11-2016@1000.html',
            '07-09-2016@900.html',
            '09-07-2016@800.html',
            '02-07-2016@400.html',
            '01-07-2016@300.html',
            '01-07-2016@200.html',
            '01-07-2016@100.html',
            '02-07-2015@50.html'
        ],

        'Should sort names with very different pre-divider values'
    );

    //
    //

    names = [
        '01-07-2016@200.html',
        '01-07-2016@300.html',
        '01-07-2016@100.html',
        '02-07-2016@400.html',
        '07-09-2016@900.html',
        '02-07-2015@50.html',
        '09-07-2016@800.html',
        '23-11-2016@1000.html'
    ];

    t.deepEqual(
        sortNames(names, false),

        [
            '02-07-2015@50.html',
            '01-07-2016@100.html',
            '01-07-2016@200.html',
            '01-07-2016@300.html',
            '02-07-2016@400.html',
            '09-07-2016@800.html',
            '07-09-2016@900.html',
            '23-11-2016@1000.html'
        ],

        'Should sort names with very different pre-divider values, asc order'
    );

    t.end();
});
