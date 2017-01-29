var fs = require('fs-extra');

var log = require('../server/log-wrapper');

import parseFile from '../server/parse-file.js';

const writeResult = (result, filePath) => {
    let exists = false;

    try {
        fs.accessSync(filePath.path, fs.F_OK);
        exists = !exists;
    } catch (err) {
        log.verbose(err);
    }

    if (exists) {
        // file exists, read and merge data
        log.warn(`File ${filePath.name}.json already exists. Updating file with new data...`);

        const existingData = parseFile(filePath.path);

        result = Object.assign({}, existingData || {}, result);
    } else {
        // file does not exist
        log.warn('File ' + filePath.name + '.json' + ' does not exist. Creating file...');
    }

    fs.writeJsonSync(filePath.path, result);

    log.verbose('New sources were added to:');
    log.info(filePath.path);
    log.verbose('Sources fill dialog now terminates');
};

export default writeResult;
