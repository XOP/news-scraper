import path from 'path';

import is from 'is';
import dateFormat from 'date-format';

import filterData from './filter-data.js';

import log from './utils/log-wrapper.js';
import { readFile, writeFile } from './utils/file-ops.js';
import extractFormat from './utils/extract-format.js';
import parseFile from './utils/parse-file.js';
import formatFileName from './utils/format-file-name.js';

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

    let newData = pages;

    if (cfg.updateStrategy === 'compare') {
        newData = readFile(currentDataPath, 'utf8')
            .then(currentFileData => parseFile(currentFileData, currentFormat))
            .then(currentData => {
                if (currentData) {
                    const filteredData = filterData(pages, currentData);

                    log.verbose('Comparing complete');

                    if (filteredData) {
                        log.warn(`New data discovered! Updating ${cfg.output.current}...`);
                        writeFile(currentDataPath, JSON.stringify(filteredData), 'utf8');

                        return filteredData;
                    } else {
                        log.verbose('Nothing to compare');
                        log.warn('No new data discovered. Try again later or change directives!');

                        return [];
                    }
                } else {
                    log.err(`${cfg.output.current} exists, but seems to be empty or corrupted`);
                }
            })
            .catch(err => {
                log.error(err);
                log.verbose('Nothing to compare');

                // create file with new data
                log.warn(`Creating ${cfg.output.current} for the first time...`);
                writeFile(currentDataPath, JSON.stringify(pages), 'utf8');

                return pages;
            });
    } else if (cfg.updateStrategy === 'scratch') {

        // todo: move to utils method
        let preciseDate = dateFormat('dd-MM-yyyy', new Date());

        preciseDate += '@';
        preciseDate += new Date().getTime();

        const dataFileName = formatFileName(
            cfg.output.path,
            'data',
            preciseDate,
            'json'
        );

        log.verbose('Creating new data file:');
        log.verbose(dataFileName);

        writeFile(dataFileName, JSON.stringify(newData), 'utf8');
    }

    return newData;
};

export default compareData;
