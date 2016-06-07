var path = require('path');

var HOST_NAME = 'https://github.com/XOP';
var REPO_NAME = 'my-favourite-front-end-resources';

var config = {
    source: {
        path: path.join(__dirname, 'source'),
        file: 'local.yml'
    },
    repo: {
        name: REPO_NAME,
        path: HOST_NAME + '/' + REPO_NAME,
        file: 'scraper.yml'
    },
    limit: 3
};

module.exports = config;
