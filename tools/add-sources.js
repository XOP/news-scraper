var log = require('log-util');
var prompt = require('prompt');

var cfg = require('../config.js');

// Regular Expression for URL validation
// Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
// https://gist.github.com/dperini/729294
var urlRegexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

var schema = {
    properties: {
        title: {
            type: 'string',
            message: 'Title of the source',
            required: true
        },

        url: {
            type: 'string',
            pattern: urlRegexp,
            message: 'Please enter valid url,\ne.g. "http://www.news.com/articles"',
            required: true
        },

        elem: {
            type: 'string',
            message: 'Please enter valid CSS selector for the <a>...</a> element,\ne.g. "#content .articles > .post li h3 > a"',
            required: true
        },

        limit: {
            type: 'number',
            message: 'Please specify maximum number of links to parse.\nThe default is ' + cfg.limit + ', the possible maximum is ' + cfg.absLimit,
            required: false,
            conform: function (value) {
                if (typeof value === 'number') {
                    return value < cfg.absLimit;
                } else {
                    return false;
                }
            }
        }
    }
};

log.verbose('Starting sources fill dialog...');

var newSources = [];

prompt.start();

var addSourceDialog = function () {
    prompt.get(schema, function (err, result) {
        if (err) {
            log.error(err);
            return;
        }

        log.verbose('New Source has been added:');
        log.info('\n' +
            result.title + '\n' +
            '    ' + 'url: ' + result.url + '\n' +
            '    ' + 'elem: ' + result.elem + '\n' +
            '    ' + 'limit: ' + result.limit
        );

        newSources.length++;

        prompt.get({
            properties: {
                'add another source?': {
                    type: 'string',
                    required: true,
                    message: 'Add another source? Type "y" or "n"',
                    conform: function (value) {
                        return value === 'y' || value === 'n';
                    }
                }
            }
        }, function (err, result) {
            if (err) {
                log.error(err);
                return;
            }

            if (result['add another source?'] === 'y') {
                addSourceDialog();
            } else {
                log.info('Number of sources added: ' + newSources.length);
                log.verbose('Sources fill dialog now terminates');

                return false;
            }
        });
    });
};

addSourceDialog();
