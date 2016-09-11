import Promise from 'bluebird';

import fetchPage from './fetch-page.js';
import limitData from './limit-data.js';
import refineData from './refine-data.js';
import compareData from './compare-data.js';

import log from '../utils/log-wrapper.js';

const scraper = (directives, cfg, debugStage = '') => {

    // fetch page data
    const scrapedData = Promise.mapSeries(directives, fetchPage);

    if (debugStage === 'data') {
        return;
    }

    // limit data
    const limitedData = scrapedData
        .then(scrapedData => {
            log.debug('scraped data', scrapedData);

            return limitData(scrapedData, cfg.limit);
        })
        .catch(err => {
            log.error(err);
        });

    if (debugStage === 'limit') {
        return;
    }

    // refine data
    const refinedData = limitedData
        .then(limitedData => {
            log.debug('limited data', limitedData);

            return refineData(limitedData);
        })
        .catch(err => {
            log.error(err);
        });

    if (debugStage === 'refine') {
        return;
    }

    // compare to previous data
    const currentData = refinedData
        .then(refinedData => {
            log.debug('refined data', refinedData);

            return compareData(refinedData, cfg.output.path, cfg.output.current, cfg.updateStrategy);
        })
        .catch(err => {
            log.error(err);
        });

    if (debugStage === 'compare') {
        return;
    }

    return currentData;
};

export default scraper;
