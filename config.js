var path = require('path');
var fs = require('fs-extra');

var _merge = require('lodash.merge');

var log = require('log-util');

// ==================================================
// Repository
// ==================================================

var HOST_NAME = 'https://github.com/XOP';
var REPO_NAME = 'news-scraper-directives';


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
        file: LOCAL_FILES // todo: remove in favor of local.path
    },
    repo: {
        name: REPO_NAME,
        path: HOST_NAME + '/' + REPO_NAME,
        file: REPO_FILES, // todo: remove and leave dir only
        use: true
    },
    local: {
        path: 'local',
        use: true
    },
    output: {
        path: path.join(__dirname, 'data'),
        fileName: '',
        fileDate: true,
        fileExt: 'html',
        current: 'data.json'
    },
    publish: {
        path: path.join(__dirname, 'public')
    },
    assets: {
        path: path.join(__dirname, 'assets')
    },
    sourceFormats: ['json', 'yml'],
    limit: 3,
    absLimit: 50,
    localOnly: false, // todo: remove in favor of individual selection
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
