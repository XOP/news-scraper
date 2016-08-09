import log from './log-wrapper.js';
import YAML from 'yamljs';

const parseFile = ((fileData, format = 'json') => {
    if (!fileData) {
        log.error('No file data provided. Check parseFile arguments.');
        process.exit(1);
    }

    let parsedFileData = fileData;

    log.debug('file Data', parsedFileData);
    log.debug('file Format', format);

    switch (format) {
        case 'json':
        case 'JSON':
            parsedFileData = JSON.parse(parsedFileData);
            break;

        case 'yml':
        case 'yaml':
        case 'YML':
        case 'YAML':
            parsedFileData = YAML.parse(parsedFileData);
            break;

        default:
            log.error(`parseFile: format "${format}" is not supported`);
            return null;
    }

    log.debug('Parsed fileData', parsedFileData);

    return parsedFileData;
});

export default parseFile;
