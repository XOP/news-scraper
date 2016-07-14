import fs from 'fs';
import path from 'path';

import is from 'is';
import Promise from 'bluebird';

import log from './utils/log-wrapper.js';
import parseFile from './utils/parse-file.js';
import { readFile } from './utils/file-ops.js';

const fetchPaths = (local, repo) => {
    if (!repo) {
        log.warn('Repository path not provided. Proceeding with Local only...');
    }

    if (!local) {
        log.error('No paths provided. Check fetchPaths arguments.');
        process.exit(1);
    }

    if (!is.array(local)) {
        log.error('Local paths type is not Array. Exiting...');
        process.exit(1);
    }

    if (repo && !is.array(repo)) {
        log.error('Repo paths type is not Array. Exiting...');
        process.exit(1);
    }

    const extractFormat = name => path.extname(name).split('.')[1];

    const sources = repo ? local.concat(repo) : local;

    return Promise.mapSeries(sources, (srcItem) => {
        const itemFormat = extractFormat(srcItem);

        return readFile(srcItem, 'utf8')
            .then(itemPaths => parseFile(itemPaths, itemFormat))
            .catch(err => {
                log.error(err);
            });
        })
        .then(result =>
            // merging collections into one object
            // { {1, 2}, {3, 4}, ... } >>> {1, 2, 3, 4, ...}
            result.reduce(
                // this strategy implies replacement of item values
                // if there are same keys in subsequent objects
                (a, b) => Object.assign({}, a, b)
            )
        )
        .catch(err => {
            log.error(err);
        });
};

export default fetchPaths;
