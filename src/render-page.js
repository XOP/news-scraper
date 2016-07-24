import fs from 'fs';
import path from 'path';

import is from 'is';
import dateFormat from 'date-format';

import log from './utils/log-wrapper.js';
import { writeFile } from './utils/file-ops.js';
import formatFilename from './utils/format-file-name.js';
import sectionTemplate from './utils/section-tpl.js';
import pageTemplate from './utils/page-tpl.js';

import cfg from '../config.js';

const date = dateFormat('dd-MM-yyyy', new Date());
let preciseDate = date;

preciseDate += '@';
preciseDate += new Date().getTime();

const file = formatFilename(
    cfg.output.path,
    cfg.output.fileName,
    cfg.output.fileDate && preciseDate,
    cfg.output.fileExt
);

const renderPage = (pages, filePath = file) => {
    if (!pages) {
        log.error('No data to render. Check renderPage params.');
        process.exit(1);
    }

    if (!is.array(pages)) {
        log.error('Pages type is not Array. Check renderPage params.');
        process.exit(1);
    }

    if (!pages.length) {
        log.warn('No data to render. Exiting...');
        return false;
    }

    const input = pages.reduce(
        (initialInput, page) => {
            const pageRender = sectionTemplate(page);

           return initialInput.concat(pageRender);
        },
        []
    ).join('');

    const title = `Scraped links for: ${date}`;
    const output = pageTemplate(title, input);

    log.verbose('Rendering page to a file: ');
    log.verbose(filePath);

    return writeFile(filePath, output, 'utf8');
};

export default renderPage;
