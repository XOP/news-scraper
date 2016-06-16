var test = require('tape');

require('../tools/selenium-check.js');

var fetchPage = require('../dist/fetch-page.js');

var props = {
    url: 'https://davidwalsh.name/',
    link: '#main > ul > li.vert + li > div.preview > h2 > a'
};

var pagePromise = fetchPage(props);

test('Fetch page test', function (t) {
    pagePromise
        .then(function (html) {
            console.log(html);

            t.ok(html, 'Parsing success');
        })
        .catch(function (err) {
            t.notok(err, 'Error occurred');
        });

    t.end();
});
