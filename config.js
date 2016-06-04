var path = require('path');

var HOST_NAME = 'https://github.com/XOP';
var REPO_NAME = 'my-favourite-front-end-resources';

var config = {
    assets: path.join(__dirname, 'assets'),
    repo: REPO_NAME,
    git: HOST_NAME + '/' + REPO_NAME,
    source: 'scraper.yml',
    limit: 3
};

module.exports = config;
