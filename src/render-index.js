import fs from 'fs-extra';

import pageTemplate from './tpl/page-tpl.js';

import log from './utils/log-wrapper.js';
import sortNames from './utils/sort-names.js';
import { getTime, getDateMarker } from './utils/date-utils.js';

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

    // filtering files with creation postfix
    pageFileNames = pageFileNames.filter(fileName => fileName.indexOf('@') > -1);

    if (!pageFileNames.length) {
        log.warn('No html files in the output directory!');

        return;
    }

    // sorting by date; desc order
    pageFileNames = sortNames(pageFileNames);

    let indexData = pageFileNames.reduce(
        (links, fileName) => {
            const linkHref = `/${fileName}`;
            const linkName = `${fileName.split('@')[0]}`;

            const timeString = getDateMarker(fileName);
            const time = getTime(new Date(+timeString));

            const link = (
                `<li
                    ><a href="${linkHref}" title="${linkName} [${time}]">${linkName} [${time}]</a
                ></li>`
            );

            return links.concat(link);
        }, input
    ).join('');

    indexData = `<ul>${indexData}</ul>`;

    const indexHtml = pageTemplate('Scraped index', indexData);

    log.verbose('Rendering index to a file: ');
    log.verbose(`${filePath}/index.html`);

    return fs.outputFileSync(`${filePath}/index.html`, indexHtml, 'utf8');
};

export default renderIndex;
