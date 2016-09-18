import fs from 'fs-extra';
import path from 'path';

import pageTemplate from './tpl/page-tpl.js';

import log from './utils/log-wrapper.js';
import sortNames from './utils/sort-names.js';
import { getDate, getTime } from './utils/date-utils.js';
import parseFile from './utils/parse-file.js';

const renderIndex = function (filePath) {
    let input = [];

    log.verbose('Starting index render...');

    const fileNames = fs.readdirSync(filePath);

    if (!fileNames.length) {
        log.warn('Output directory is empty!');

        return;
    }

    let pageFileNames = fileNames;

    // filtering html files only
    pageFileNames = pageFileNames.filter(fileName => fileName.indexOf('.html') > -1);

    if (!pageFileNames.length) {
        log.warn('No html files in the output directory!');

        return;
    }

    // sorting by date; desc order
    pageFileNames = sortNames(pageFileNames);

    let indexLinksHtml = pageFileNames.reduce(
        (links, fileName) => {
            const linkHref = `/${fileName}`;

            const fileData = parseFile(path.join(filePath, fileName.replace('html', 'json')));
            const fileDate = fileData.meta.date;

            const fileFormattedDate = getDate(fileDate);
            const fileFormattedTime = getTime(fileDate);

            const linkTitle = `${fileFormattedDate} [${fileFormattedTime}]`;

            const link = (
                `<li
                    ><a href="${linkHref}" title="${linkTitle}">${linkTitle}</a
                ></li>`
            );

            return links.concat(link);
        }, input
    ).join('');

    indexLinksHtml = `<ul>${indexLinksHtml}</ul>`;

    const indexHtml = pageTemplate('Scraped index', indexLinksHtml);

    log.verbose('Rendering index to a file: ');
    log.verbose(`${filePath}/index.html`);

    return fs.outputFileSync(`${filePath}/index.html`, indexHtml, 'utf8');
};

export default renderIndex;
