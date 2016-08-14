var fs = require('fs-extra');
var path = require('path');
var del = require('del');

var test = require('tape');

var compareData = require('../dist/compare-data.js');

var dataPath = path.resolve(__dirname, 'fixtures/compare');

var objData = [
    {
        title: 'testData',
        url: 'http://testurl.com',
        elem: 'foo > bar',
        limit: 10,
        data: [
            {
                href: '#1',
                text: 'text 1',
                title: '',
                raw: '<a href=\'#1\'>text 1</a>'
            },
            {
                href: '#2',
                text: 'text 2',
                title: '',
                raw: '<a href=\'#2\'>text 2</a>'
            }
        ]
    }
];

var objDataBig = [
    {
        title: 'testData',
        url: 'http://testurl.com',
        elem: 'foo > bar',
        limit: 10,
        data: [
            {
                href: '#1',
                text: 'text 1',
                title: '',
                raw: '<a href=\'#1\'>text 1</a>'
            },
            {
                href: '#2',
                text: 'text 2',
                title: '',
                raw: '<a href=\'#2\'>text 2</a>'
            }
        ]
    },
    {
        title: 'testData2',
        url: 'http://testurl2.com',
        elem: 'foo > bar',
        limit: 10,
        data: [
            {
                href: '#3',
                text: 'text 3',
                title: '',
                raw: '<a href=\'#3\'>text 3</a>'
            },
            {
                href: '#4',
                text: 'text 4',
                title: '',
                raw: '<a href=\'#4\'>text 4</a>'
            }
        ]
    }
];

var objDataDiff = [
    {
        title: 'testData2',
        url: 'http://testurl2.com',
        elem: 'foo > bar',
        limit: 10,
        data: [
            {
                href: '#3',
                text: 'text 3',
                title: '',
                raw: '<a href=\'#3\'>text 3</a>'
            },
            {
                href: '#4',
                text: 'text 4',
                title: '',
                raw: '<a href=\'#4\'>text 4</a>'
            }
        ]
    }
];

function cleanup (marker) {
    fs.readdirSync(dataPath)
        .filter(function (name) {
            return name.indexOf(marker) > -1;
        })
        .forEach(function (name) {
            del(path.join(dataPath, name));
        });
}

test('Compare data test', function (t) {

    //
    // strategy == scratch

    // always creates a ne json file with the new data
    // always returns the same data passed

    t.deepEqual(
        compareData(objData, dataPath, 'data.json', 'scratch'),
        objData,

        'Should return the same data'
    );

    // find the only data file created
    var dataFile = fs.readdirSync(dataPath).filter(function (name) {
        return name.indexOf('@') > -1;
    })[0];

    t.deepEqual(
        fs.readJsonSync(path.join(dataPath, dataFile), 'utf8'),
        objData,

        'Should create file with corresponding JSON data'
    );

    cleanup('@');


    //
    // strategy == compare

    // new data, no current json file
    // json will be created with new data

    compareData(objData, dataPath, 'test-data.json', 'compare')
        .then(function () {
            t.deepEqual(
                fs.readJsonSync(path.join(dataPath, 'test-data.json'), 'utf8'),
                objData,

                'Should create a json file with the data if no current data present'
            );
        })
        .finally(function () {
            cleanup('test');
        });


    // new data equals to the json data
    // no changes to the json

    compareData(objData, dataPath, 'data.json', 'compare')
        .then(function (data) {
            t.deepEqual(
                data,
                [],

                'Should return empty array when compared to the equal data'
            );
        });


    // new data brings update to the current json
    // current json will be overwritten with the difference

    fs.copySync(path.join(dataPath, 'data.json'), path.join(dataPath, 'data-copy.json'));

    compareData(objDataBig, dataPath, 'data-copy.json', 'compare')
        .then(function () {
            t.deepEqual(
                fs.readJsonSync(path.join(dataPath, 'data-copy.json'), 'utf8'),
                objDataDiff,

                'Should overwrite a json with the new piece of data'
            );
        })
        .finally(function () {
            cleanup('copy');
        });

    t.end();
});
