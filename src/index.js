import log from 'log-util';
import YAML from 'yamljs';
import Promise from 'bluebird';

import cfg from '../config.js';

import fetchPaths from './fetch-paths.js';
import fetchPage from './fetch-page.js';

const paths = fetchPaths(cfg.source.paths);

log.info('Fetching paths...');

paths
    .then(function (res) {
        log.debug('Fetching paths done!');

        return YAML.parse(res);
    })
    .then(function (sources) {
        return Promise.mapSeries(
            sources,
            fetchPage
        );
    })
    .then(function (parsedData) {
        parsedData.map(function (data) {
            log.debug(data);
        });
    })
    .catch(function (err) {
        log.error(err);
    });
