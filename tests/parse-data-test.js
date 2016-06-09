var test = require('tape');

var parseData = require('../dist/parse-data.js');

var scrapedData = [
    '<a href="https://davidwalsh.name/javascript-sleep-function" itemprop="url">JavaScript sleep&nbsp;Function</a>',
    '<a href="https://css-tricks.com/use-airtable-front-end-developer/" class="read-article" rel="nofollow">\n      How To Use Airtable as a Front End Developer    </a>'
];

test('Source object conversion test', function (t) {
    t.equal(
        parseData(scrapedData),
        scrapedData,
        'Should log and return scrapedData'
    );

    t.end();
});


