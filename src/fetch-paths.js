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

    let paths;

    if (!repo) {
        paths = Promise.mapSeries(local, (localItem) => {
            const localFormat = extractFormat(localItem);

            return readFile(localItem, 'utf8')
                .then(localPaths => parseFile(localPaths, localFormat))
                .catch(err => {
                    log.error(err);
                });
            })
            .then(result =>
                result.reduce(
                    (a, b) => Object.assign({}, a, b)
                )
            )
            .catch(err => {
                log.error(err);
            });
    } else {
        // todo

        //    paths = readFile(repo, 'utf8')
        //        .then(repoPaths => readFile(local, 'utf8')
        //            .then(localPaths => Object.assign({},
        //                    parseFile(localPaths, localFormat),
        //                    parseFile(repoPaths, repoFormat)
        //                )
        //            )
        //            .catch(err => {
        //                log.error(err);
        //            })
        //        )
        //        .catch(err => {
        //            log.error(err);
        //        });
    }

    return paths;
};

export default fetchPaths;
