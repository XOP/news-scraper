var log = require('log-util');

var renderIndex = require('../dist/render-index.js');
var cfg = require('../config.js');

log.info('Rendering index.html...');

renderIndex(cfg.output.path)
    .then(function () {
        log.info('Rendering index.html success!');
    })
    .catch(function (err) {
        log.error(err);
    });

