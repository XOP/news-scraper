import YAML from 'yamljs';

import log from './log-wrapper.js';

const parseFileData = ((fileData, format = 'json') => {
    if (!fileData) {
        log.error('No file data provided. Check parseFile arguments.');
        process.exit(1);
    }

    let parsedData = fileData;

    log.debug('file Data', parsedData);
    log.debug('file Format', format);

    switch (format) {
        case 'json':
        case 'JSON':
            parsedData = JSON.parse(parsedData);
            break;

        case 'yml':
        case 'yaml':
        case 'YML':
        case 'YAML':
            parsedData = YAML.parse(parsedData);
            break;

        default:
            log.error(`parseFile: format "${format}" is not supported`);
            return null;
    }

    log.debug('Parsed fileData', parsedData);

    return parsedData;
});

export default parseFileData;
