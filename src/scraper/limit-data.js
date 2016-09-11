import is from 'is';

import log from './utils/log-wrapper.js';

const limitData = (pages, defaultLimit) => {
    if (!defaultLimit) {
        log.warn('No limit provided. The data will not be modified.');
    }

    if (!pages) {
        log.error('No pages data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(pages)) {
        log.error('Pages type is not Array. Exiting...');
        process.exit(1);
    }

    if (!is.number(parseInt(defaultLimit, 10))) {
        log.error('Limit type is not Number. Exiting...');
        process.exit(1);
    }

    log.verbose('Filtering empty data...');

    pages = pages.filter(page => page.data.length);

    log.verbose('Filtering complete');

    log.verbose('Now limiting the links number...');

    pages.forEach(page => {
        const limit = page.limit || defaultLimit;

        log.debug('page data', page.data);

        if (limit && limit > 0) {
            page.data = page.data.splice(0, limit);
        }
    });

    log.verbose('Limiting operation complete');

    return pages;
};

export default limitData;
