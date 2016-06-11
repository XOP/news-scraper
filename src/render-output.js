import fs from 'fs';
import path from 'path';

import log from 'log-util';
import Promise from 'bluebird';

import cfg from '../config.js';

const writeFile = Promise.promisify(fs.writeFile);

const renderOutput = (input, filePath = path.join(cfg.output.path, cfg.output.file)) => {
    if (!input) {
        log.error('No render input data. Check renderOutput params.');
        process.exit(1);
    }

    log.info(`Writing file to ${filePath}...`);

    return writeFile(filePath, input, 'utf8');
};

export default renderOutput;
