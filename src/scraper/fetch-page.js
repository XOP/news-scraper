import Promise from 'bluebird';
import Nightmare from 'nightmare';

import log from './utils/log-wrapper.js';

const nightmareOptions = {};

const fetchPage = directive => {
    log.verbose(`Fetching page content from ${directive.url}...`);
    log.debug('directive', directive);

    const nightmare = Nightmare(nightmareOptions); // eslint-disable-line

    return new Promise((resolve) => nightmare
        .goto(directive.url)
        .evaluate((directive) => {
            const nodeData = document.querySelectorAll(directive.elem);
            const stringData = Array.prototype.map.call(nodeData, dataItem => dataItem.outerHTML);

            return stringData;
        }, directive)
        .end()
        .then(data => {
            log.verbose(`Fetching page content from ${directive.url} done!`);
            log.info(`${directive.url}: ${data.length} news scraped`);
            log.debug('data', data);

            directive.data = data;
            resolve(directive);

            return data;
        })
        .catch(err => {
            log.warn(`Oops, something happened: ${err}`);
            log.warn(`${directive.url}: ${err.message}`);
            log.info(`${directive.url}: 0 news scraped`);

            directive.data = [];
            resolve(directive);
        })
    );
};

export default fetchPage;
