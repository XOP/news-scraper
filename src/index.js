import log from 'log-util';
import YAML from 'yamljs';

import cfg from '../config.js';

import fetchPaths from './fetch-paths.js';
import fetchPage from './fetch-page.js';

//
// Fetching source list

const paths = fetchPaths(cfg.source.paths);

log.info('Fetching paths...');

paths.then(function (res) {
    const pathsObject = YAML.parse(res);

    log.debug(pathsObject);
    log.info('Fetching paths done!');
});


//
// Fetching page content

/*

log.info('Fetching page content...');

const page = fetchPage(cfg.list);

page.then(function (response) {
    log.debug(response);

    log.info('Fetching page content done!');
});

*/
