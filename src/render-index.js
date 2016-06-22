import fs from 'fs';

import log from './utils/log-wrapper.js';
import html from './utils/html.js';
import Promise from 'bluebird';

const readDir = Promise.promisify(fs.readdir);
const writeFile = Promise.promisify(fs.writeFile);

const renderIndex = function (filePath) {
    let input = [];

    return readDir(filePath)
        .then(fileNames => {

            // todo: remove unused elements
            // todo: move compare func to utils

            fileNames.sort((a, b) => {
                if (a.indexOf('@') == -1 && b.indexOf('@') == -1) {
                    if (a > b) {
                        return -1;
                    } else if (a < b) {
                        return 1;
                    } else {
                        return 0;
                    }
                }

                if (a.indexOf('@') == -1 && b.indexOf('@') > -1) {
                    return 1;
                }

                if (a.indexOf('@') > -1 && b.indexOf('@') > -1) {
                    let aValue = a.split('@')[1];
                    aValue = aValue.split('.html')[0];

                    let bValue = b.split('@')[1];
                    bValue = bValue.split('.html')[0];

                    if (aValue < bValue) {
                        return 1;
                    } else if (aValue > bValue) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            });

            return fileNames.reduce(
                (links, fileName) => {
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
