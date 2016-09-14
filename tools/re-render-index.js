var log = require('log-util');

var renderIndex = require('../dist/render-index.js');
var cfg = require('../config.js');

log.info('Rendering index.html...');

try {
    renderIndex(cfg.output.path);
    log.info('Rendering index.html success!');
} catch (err) {
    log.error(err, 'Rendering index.html failed');
}
