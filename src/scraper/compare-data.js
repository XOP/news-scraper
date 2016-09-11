import fs from 'fs-extra';
import path from 'path';

import is from 'is';

import filterData from './filter-data.js';

import log from './utils/log-wrapper.js';
import parseFile from './utils/parse-file.js';

const compareData = (pages, outputPath = './', currentOutput = 'data.json', updateStrategy = '') => {
    if (!pages) {
        log.error('No pages data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(pages)) {
        log.error('Pages type is not Array. Exiting...');
        process.exit(1);
    }

    log.verbose('Comparing data...');
    log.verbose(`Update strategy: ${updateStrategy}`);

    log.debug('new pages', pages);

    const currentDataPath = path.resolve(outputPath, currentOutput);

    let newData = pages;

    if (updateStrategy === 'compare') {
        let currentData;

        try {
            currentData = parseFile(currentDataPath);

            // todo: check currentData.length?
            if (currentData) {
                const filteredData = filterData(pages, currentData);

                log.verbose('Comparing complete');

                if (filteredData && filteredData.length) {
                    log.warn(`New data discovered! Updating ${currentOutput}...`);
                    fs.writeJsonSync(currentDataPath, filteredData);

                    newData = filteredData;
                } else {
                    log.verbose('Nothing to compare');
                    log.warn('No new data discovered. Try again later or change directives!');

                    newData = [];
                }
            } else {
                log.err(`${currentOutput} exists, but seems to be empty or corrupted`);
            }
        } catch (err) {
            log.error(err);
            log.verbose('Nothing to compare');

            // create file with new data
            log.warn(`Creating ${currentOutput} for the first time...`);
            fs.writeJsonSync(currentDataPath, pages);
        }
    } else if (updateStrategy === 'scratch') {
        const currentDate = new Date().getTime();
        const dataFileName = path.join(outputPath, `${currentDate}.json`);

        log.verbose('Creating new data file:');
        log.verbose(dataFileName);

        fs.writeJsonSync(dataFileName, newData);
    }

    return newData;
};

export default compareData;
