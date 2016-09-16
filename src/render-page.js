import fs from 'fs-extra';
import is from 'is';

import sectionTemplate from './tpl/section-tpl.js';
import pageTemplate from './tpl/page-tpl.js';

import log from './utils/log-wrapper.js';
import formatFilename from './utils/format-file-name.js';
import { getDate, getTime, getDateMarker, getPreciseDate } from './utils/date-utils.js';

import cfg from '../config.js';

// todo: extract date marker from the data file name
const currentDate = new Date();

const date = getDate(currentDate);
const time = getTime(currentDate);
const preciseDate = getPreciseDate(currentDate, getDateMarker());

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
        log.warn('No data to render!');
        return false;
    }

    const pageBodyHtml = pages.reduce(
        (html, page) => {
            const sectionHtml = sectionTemplate(page);

            return html.concat(sectionHtml);
        },
        []
    ).join('');

    const pageTitle = `Scraped links for: ${date}, ${time}`;
    const pageHtml = pageTemplate(pageTitle, pageBodyHtml);

    log.verbose('Rendering page to a file: ');
    log.verbose(filePath);

    return fs.outputFileSync(filePath, pageHtml, 'utf8');
};

export default renderPage;
