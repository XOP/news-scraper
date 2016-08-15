var test = require('tape');

var fetchPage = require('../dist/fetch-page.js');

var props = {
    url: 'http://css-tricks.com/',
    elem: '#page-wrap .main-col .article-card > h2 > a.read-article'
};

test('Fetch page test', function (t) {
    var pagePromise = fetchPage(props);

    pagePromise
        .then(function (result) {
            t.ok(result.data, 'Parsing success');
            t.end();
        })
        .catch(function (err) {
            t.notok(err, 'Error occurred');
            t.end();
        });
});
