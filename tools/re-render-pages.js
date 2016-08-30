var fs = require('fs');
var path = require('path');

var log = require('log-util');

var renderPage = require('../dist/render-page.js');

var cfg = require('../config.js');

log.info('Rendering pages...');

fs.readdir(cfg.output.path, function (err, files) {
    if (err) {
        log.error(err);
    }

    files = files.filter(function (fileName) {
        return fileName.indexOf('.json') > -1;
    });

    if (files.length) {
        var counter = 0;

        files.forEach(function (filePath) {
            var fileName = filePath;

            fileName = fileName.split('.json')[0];
            fileName = fileName.split('data--')[1];
            fileName += '.';
            fileName += cfg.output.fileExt;

            var fileData = fs.readFileSync(path.join(cfg.output.path, filePath), 'utf8');

            renderPage(JSON.parse(fileData), path.join(cfg.output.path, fileName));

            if (++counter === files.length) {
                log.info('Rendering pages success!');
            }
        });
    } else {
        log.warn('output directory seems to have no JSON data');
    }
});
