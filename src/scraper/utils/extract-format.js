import path from 'path';

import log from './log-wrapper';

const extractFormat = (name) => {
    if (name.indexOf('.') === -1) {
        log.error(`File path is incorrect: ${name}`);
        process.exit(1);
    }

    return path.extname(name).split('.')[1];
};

export default extractFormat;
