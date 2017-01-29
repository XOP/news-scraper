import is from 'is';

import log from './log-wrapper.js';
import parseFile from './parse-file.js';

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

    const sources = repo ? local.concat(repo) : local;

    log.debug('sources', sources);

    return sources.reduce(
       (directives, srcItem) => Object.assign(directives, parseFile(srcItem)),
       {}
    );
};

export default fetchPaths;
