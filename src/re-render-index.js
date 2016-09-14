import log from 'log-util';

import renderIndex from './render-index.js';

import cfg from '../config.js';

log.verbose('Rendering index.html...');

try {
    renderIndex(cfg.output.path);
    log.info('Rendering index.html success!');
} catch (err) {
    log.error('Rendering index.html failed', err);
} finally {
    log.verbose('Rendering index.html finished');
}
