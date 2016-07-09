var path = require('path');

var log = require('log-util');
var prompt = require('prompt');

var cfg = require('../../config.js');
var schema = require('./schema.js')(cfg);
var writeResult = require('./write-result.js');

var newSources = [];

var customFilename = 'custom';
var filePath = function (fileName) {
    fileName = fileName || customFilename;

    return {
        path: path.resolve(__dirname, cfg.source.path, fileName + '.json'),
        name: fileName
    };
};

log.verbose('Starting sources fill dialog...');

prompt.start();

var addSourceDialog = function () {
    prompt.get(schema, function (err, result) {
        if (err) {
            log.error(err);
            return;
        }

        log.verbose('New Source has been added:');

        var title = result.title;
        var url = result.url;
        var elem = result.elem;
        var limit = result.limit;

        log.info('\n' +
            result.title + '\n' +
            '    ' + 'url: ' + result.url + '\n' +
            '    ' + 'elem: ' + result.elem + '\n' +
            '    ' + 'limit: ' + result.limit
        );

        var source = {};

        source[title] = {
            url: url,
            elem: elem,
            limit: limit
        };

        newSources = newSources.concat(source);

        prompt.get({
            properties: {
                'add another source? y/n': {
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

            if (result['add another source? y/n'] === 'y') {
                addSourceDialog();
            } else {
                log.info('Number of sources added: ' + newSources.length);

                writeResult(newSources, filePath());

                // end dialog
                return false;
            }
        });
    });
};

addSourceDialog();
