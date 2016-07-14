var path = require('path');


// ==================================================
// Repository
// ==================================================

var HOST_NAME = 'https://github.com/XOP';
var REPO_NAME = 'my-favourite-front-end-resources';


// ==================================================
// Directives
// ==================================================

// todo: if there is no array data specified parse directory and utilize directives by alphabet order

var LOCAL_FILES = 'local.yml';
var REPO_FILES = ['scraper.yml', 'blogs.yml'];


// ==================================================
// Config
// ==================================================

var config = {
    source: {
        path: path.join(__dirname, 'source'),
        file: LOCAL_FILES
    },
    repo: {
        name: REPO_NAME,
        path: HOST_NAME + '/' + REPO_NAME,
        file: REPO_FILES
    },
    output: {
        path: path.join(__dirname, 'data'),
        fileName: '',
        fileDate: true,
        fileExt: 'html'
    },
    limit: 3,
    absLimit: 50,
    localOnly: false,
    silent: false
};

module.exports = config;
