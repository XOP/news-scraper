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

test('Compare data test', function (t) {

    //
    // strategy == scratch

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

    //
    // strategy == compare

    // todo

    //
    // cleanup

    fs.readdirSync(dataPath)
        .filter(function (name) {
            return name.indexOf('@') > -1;
        })
        .forEach(function (name) {
            del(path.join(dataPath, name));
        });

    t.end();
});
