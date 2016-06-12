import fs from 'fs';
import path from 'path';

import log from './utils/log-wrapper.js';
import YAML from 'yamljs';
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

    let paths;

    if (!repo) {
        paths = readFile(local, 'utf8')
            .then(localPaths => YAML.parse(localPaths))
            .catch(err => {
                log.error(err);
            });
    } else {
        paths = readFile(repo, 'utf8')
            .then(repoPaths => readFile(local, 'utf8')
                .then(localPaths => Object.assign({},
                        YAML.parse(localPaths),
                        YAML.parse(repoPaths)
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
