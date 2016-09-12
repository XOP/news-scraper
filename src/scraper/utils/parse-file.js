import fs from 'fs-extra';

import extractFormat from './extract-format.js';
import parseFileData from './parse-filedata.js';

const parseFile = fileName => {
    const fileFormat = extractFormat(fileName);
    const fileData = fs.readFileSync(fileName, 'utf8');

    return parseFileData(fileData, fileFormat);
};

export default parseFile;
