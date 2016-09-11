import pageTemplate from './tpl/page-tpl.js';

import log from './utils/log-wrapper.js';
import sortNames from './utils/sort-names.js';
import { getTime, getDateMarker } from './utils/date-utils.js';
import { readDir, writeFile } from './utils/file-ops.js';

const renderIndex = function (filePath) {
    let input = [];

    log.verbose('Starting index render...');

    return readDir(filePath)
        .then(fileNames => {
            // filtering html files only
            fileNames = fileNames.filter(fileName => fileName.indexOf('.html') > -1);

            // filtering files with creation postfix
            fileNames = fileNames.filter(fileName => fileName.indexOf('@') > -1);

            // sorting by date; desc order
            fileNames = sortNames(fileNames);

            return fileNames.reduce(
                (links, fileName) => {
                    const linkHref = `/${fileName}`;
                    const linkName = `${fileName.split('@')[0]}`;

                    const timeString = getDateMarker(fileName);
                    const time = getTime(new Date(+timeString));

                    const link = (
                        `<div
                            ><a href="${linkHref}" title="${linkName} [${time}]">${linkName} [${time}]</a
                        ></div>`
                    );

                    return links.concat(link);
                }, input
            ).join('');
        })
        .then(data => {
            const output = pageTemplate('Scraped index', data);

            log.verbose('Rendering index to a file: ');
            log.verbose(`${filePath}/index.html`);

            return writeFile(`${filePath}/index.html`, output, 'utf8');
        })
        .catch(err => {
            log.error(err);
        });
};

export default renderIndex;
