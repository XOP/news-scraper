import fs from 'fs-extra';

import is from 'is';

import sectionTemplate from './tpl/section-tpl.js';
import pageTemplate from './tpl/page-tpl.js';

import log from './utils/log-wrapper.js';
import { getDate, getTime } from './utils/date-utils.js';

const renderPage = (complexData, filePath = '') => {
    const {
        meta,
        pages
        } = complexData;

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

    const fileDate = meta.date;

    // todo: move data generation to scraper?
    const date = getDate(fileDate);
    const time = getTime(fileDate);

    const pageTitle = `Scraped links for: ${date}, ${time}`;
    const pageHtml = pageTemplate(pageTitle, pageBodyHtml);

    filePath = filePath || meta.file.replace('json', 'html');

    log.verbose('Rendering page to a file: ');
    log.verbose(filePath);

    return fs.outputFileSync(filePath, pageHtml, 'utf8');
};

export default renderPage;
