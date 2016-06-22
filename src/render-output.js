import fs from 'fs';
import path from 'path';

import is from 'is';
import log from './utils/log-wrapper.js';
import Promise from 'bluebird';
import dateFormat from 'date-format';

import formatFilename from './utils/format-file-name.js';
import html from './utils/html.js';
import cfg from '../config.js';

const writeFile = Promise.promisify(fs.writeFile);

let date = dateFormat('dd-MM-yyyy', new Date());
date += '@';
date += new Date().getTime();

const file = formatFilename(
    cfg.output.path,
    cfg.output.fileName,
    cfg.output.fileDate && date,
    cfg.output.fileExt
);

const renderOutput = (input, filePath = file) => {
    if (!input) {
        log.error('No render input data. Check renderOutput params.');
        process.exit(1);
    }

    if (!is.string(input)) {
        log.error('Data has incorrect format. Check renderOutput params.');
        process.exit(1);
    }

    log.info(`Writing file to ${filePath}...`);

    const title = `Scraped links for: ${date}`;
    const output = html(title, input);

    return writeFile(filePath, output, 'utf8');
};

export default renderOutput;
