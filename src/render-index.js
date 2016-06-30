import fs from 'fs';

import log from './utils/log-wrapper.js';
import html from './utils/html.js';
import sortNames from './utils/sort-names.js';
import Promise from 'bluebird';

const readDir = Promise.promisify(fs.readdir);
const writeFile = Promise.promisify(fs.writeFile);

const renderIndex = function (filePath) {
    let input = [];

    return readDir(filePath)
        .then(fileNames => {
            fileNames = sortNames(fileNames);

            return fileNames.reduce(
                (links, fileName) => {
                    // todo: remove unused elements

                    if (
                        ~fileName.indexOf('git') ||
                        ~fileName.indexOf('index')
                    ) {
                        return links;
                    }

                    const linkHref = `/${fileName}`;
                    const linkName = `${fileName.split('.html')[0]}`;
                    const link = `<a href="${linkHref}" title="${linkName}">${linkName}</a>`;

                    return links.concat(link);
                }, input
            ).join('')
        })
        .then(data => {
            const output = html('Scraped index', data);

            return writeFile(`${filePath}/index.html`, output, 'utf8');
        })
        .catch(err => {
            log.error(err);
        });
};

export default renderIndex;
