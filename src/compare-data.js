import path from 'path';

import is from 'is';

import filterData from './filter-data.js';

import log from './utils/log-wrapper.js';
import { readFile } from './utils/file-ops.js';
import { writeFile } from './utils/file-ops.js';
import extractFormat from './utils/extract-format.js';
import parseFile from './utils/parse-file.js';

import cfg from '../config.js';

const compareData = (pages) => {
    if (!pages) {
        log.error('No pages data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(pages)) {
        log.error('Pages type is not Array. Exiting...');
        process.exit(1);
    }

    log.verbose('Comparing data...');

    log.debug('new pages', pages);

    const currentDataPath = path.resolve(cfg.output.path, cfg.output.current);
    const currentFormat = extractFormat(currentDataPath);

    const newData = readFile(currentDataPath, 'utf8')
        .then(currentFileData => parseFile(currentFileData, currentFormat))
        .then(currentData => {
            if (currentData) {
                const filteredData = filterData(pages, currentData);

                log.verbose('Comparing complete');

                if (filteredData) {
                    log.warn('New data discovered! Updating data.json...');
                    writeFile(currentDataPath, JSON.stringify(filteredData), 'utf8');

                    return filteredData;
                } else {
                    log.verbose('Nothing to compare');
                    log.warn('No new data discovered. Try again later or change directives!');

                    return [];
                }
            } else {
                log.err('data.json exists, but seems to be empty or corrupted');
            }
        })
        .catch(err => {
            log.error(err);
            log.verbose('Nothing to compare');

            // create file with new data
            log.warn('Creating data.json for the first time...');
            writeFile(currentDataPath, JSON.stringify(pages), 'utf8');

            return pages;
        });

    return newData;
};

export default compareData;
