import fs from 'fs';
import path from 'path';

import log from 'log-util';
import YAML from 'yamljs';
import Promise from 'bluebird';

const readFile = Promise.promisify(fs.readFile);

const fetchPaths = (repo, local) => {
    if (!local) {
        log.error('Insufficient arguments. Check fetchPaths params.');
        process.exit(1);
    }

    return readFile(repo, 'utf8')
        .then(function (repoPaths) {
            return readFile(local, 'utf8')
                .then(function (localPaths) {
                    return Object.assign({},
                        YAML.parse(localPaths),
                        YAML.parse(repoPaths)
                    );
                })
                .catch(function (err) {
                    log.error(err);
                });
        })
        .catch(function (err) {
            log.error(err);
        });
};

export default fetchPaths;
