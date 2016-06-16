import is from 'is';
import log from './utils/log-wrapper.js';

import cfg from '../config.js';

const parseData = (pages) => {
    if (!pages) {
        log.error('No pages data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(pages)) {
        log.error('Pages type is not Array. Exiting...');
        process.exit(1);
    }

    let parseResult = [];

    pages.forEach(page => {
        let pageContent = '';
        const limit = page.limit || cfg.limit;

        let links = page.data.splice(0, limit);
        links = links.join('');

        pageContent += `<h2>${page.title}</h2>`;
        pageContent += `<article>${links}</article>`;

        parseResult.push(pageContent.trim());
    });

    log.info('All links parsed!');

    return parseResult.join('');
};

export default parseData;
