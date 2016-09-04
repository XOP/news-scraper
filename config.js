var path = require('path');
var fs = require('fs-extra');

var _merge = require('lodash.merge');

var log = require('log-util');

// ==================================================
// Repository
// ==================================================

var HOST_NAME = 'https://github.com/XOP';
var REPO_NAME = 'my-favourite-front-end-resources';


// ==================================================
// Directives
// ==================================================

var LOCAL_FILES = 'local.yml';
var REPO_FILES = []; // todo: check empty paths and stop process


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
        fileExt: 'html',
        current: 'data.json'
    },
    assets: {
        path: path.join(__dirname, 'assets')
    },
    sourceFormats: ['json', 'yml'],
    limit: 3,
    absLimit: 50,
    localOnly: false,
    silent: false,
    updateStrategy: 'scratch' // scratch | compare
};

var userConfig = {};

try {
    userConfig = fs.readJsonSync(path.join(__dirname, 'user.json'));
} catch (err) {
    log.warn('user.json does not exist, proceeding with default settings...');
}

var mergedConfig = _merge(config, userConfig);

module.exports = mergedConfig;
