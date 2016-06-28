import is from 'is';
import cheerio from 'cheerio';

import log from './utils/log-wrapper.js';

import cfg from '../config.js';

const refineData = (pages) => {
    if (!pages) {
        log.error('No pages data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(pages)) {
        log.error('Pages type is not Array. Exiting...');
        process.exit(1);
    }

    const refinedData = pages.reduce(
        (initialData, page) => {
            page.data = page.data.reduce(
                (arr, data) => {
                    const $ = cheerio.load(data);
                    const a = $('a');

                    const link = {
                        href: a.attr('href') || '',
                        text: a.text() || '',
                        title: a.attr('title') || '',
                        raw: data
                    };

                    return arr.concat(link);
                },
                []
            );

            log.debug('refined data', page.data);

            return initialData.concat(page);
        },
        []
    );

    log.info('All data refined!');

    return refinedData;
};

export default refineData;
