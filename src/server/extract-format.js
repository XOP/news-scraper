import path from 'path';

import log from './log-wrapper';

import cfg from '../../config';

const extractFormat = (name) => {
    if (name.indexOf('.') === -1) {
        log.error(`File path is incorrect: ${name}`);
        process.exit(1);
    }

    const format = path.extname(name).split('.')[1];

    if (cfg.sourceFormats.indexOf(format) === -1) {
        log.error(`File format is not supported: ${name}`);
        process.exit(1);
    }

    return format;
};

export default extractFormat;
