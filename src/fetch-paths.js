import fs from 'fs';
import path from 'path';

import log from './utils/log-wrapper.js';
import parseFile from './utils/parse-file.js';
import Promise from 'bluebird';

const readFile = Promise.promisify(fs.readFile);

const fetchPaths = (local, repo) => {
    if (!repo) {
        log.warn('Repository path not provided. Proceeding with Local only...');
    }

    if (!local) {
        log.error('No paths provided. Check fetchPaths arguments.');
        process.exit(1);
    }

    const localFormat = path.extname(local).split('.')[1];
    const repoFormat = repo && path.extname(repo).split('.')[1];

    let paths;

    if (!repo) {
        paths = readFile(local, 'utf8')
            .then(localPaths => parseFile(localPaths, localFormat))
            .catch(err => {
                log.error(err);
            });
    } else {
        paths = readFile(repo, 'utf8')
            .then(repoPaths => readFile(local, 'utf8')
                .then(localPaths => Object.assign({},
                        parseFile(localPaths, localFormat),
                        parseFile(repoPaths, repoFormat)
                    )
                )
                .catch(err => {
                    log.error(err);
                })
            )
            .catch(err => {
                log.error(err);
            });
    }

    return paths;
};

export default fetchPaths;
