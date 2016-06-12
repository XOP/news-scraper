import fs from 'fs';
import path from 'path';

import is from 'is';
import log from './utils/log-wrapper.js';
import Promise from 'bluebird';
import dateFormat from 'date-format';

import formatFilename from './utils/format-file-name.js';
import cfg from '../config.js';

const writeFile = Promise.promisify(fs.writeFile);

const date = dateFormat('dd-MM-yyyy', new Date());
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

    const output = `<!doctype html>
    <html>
        <head>
            <title>Scraped links for: ${date}</title>
            <style>
                body {
                    font: 16px/1.5 sans-serif;
                }
                a {
                    display: block;
                    padding: .5rem;
                    color: #333;
                }
                a:hover {
                    color: #fff;
                    background: #666;
                }
            </style>
        </head>
        <body>${input}</body>
    </html>`;

    return writeFile(filePath, output, 'utf8');
};

export default renderOutput;
