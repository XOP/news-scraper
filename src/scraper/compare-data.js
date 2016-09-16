import fs from 'fs-extra';
import path from 'path';

import is from 'is';

import filterData from './filter-data.js';

import log from './utils/log-wrapper.js';
import parseFile from './utils/parse-file.js';

const compareData = (complexData, outputPath = './', currentOutput = 'data.json', updateStrategy = '') => {
    const {
        meta,
        pages
        } = complexData;

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
    const currentDate = new Date().getTime();
    const dataFileName = path.join(outputPath, `${currentDate}.json`);

    let updatedComplexData = {
        meta: Object.assign(meta, {
            file: dataFileName,
            date: currentDate
        }),
        pages
    };

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

                    updatedComplexData.pages = filteredData;

                    fs.writeJsonSync(currentDataPath, updatedComplexData);
                    fs.writeJsonSync(dataFileName, updatedComplexData);
                } else {
                    log.verbose('Nothing to compare');
                    log.warn('No new data discovered. Try again later or change directives!');

                    updatedComplexData.pages = [];
                }
            } else {
                log.error(`${currentOutput} exists, but seems to be empty or corrupted`);
            }
        } catch (err) {
            log.error(err);
            log.verbose('Nothing to compare');

            // create file with new data
            log.warn(`Creating ${currentOutput} for the first time...`);

            fs.writeJsonSync(currentDataPath, updatedComplexData);
            fs.writeJsonSync(dataFileName, updatedComplexData);
        }
    } else if (updateStrategy === 'scratch') {
        log.verbose('Creating new data file:');
        log.verbose(dataFileName);

        fs.writeJsonSync(dataFileName, updatedComplexData);
    }

    return updatedComplexData;
};

export default compareData;
