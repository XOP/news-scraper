import path from 'path';

import log from 'log-util';
import Promise from 'bluebird';

import cfg from '../config.js';

import fetchPaths from './fetch-paths.js';
import fetchPage from './fetch-page.js';

const localSrcPath = path.resolve(__dirname, cfg.source.path, cfg.source.file);
const repoSrcPath = path.resolve(__dirname, cfg.source.path, cfg.repo.name, cfg.repo.file);

const paths = fetchPaths(localSrcPath, repoSrcPath);

log.info('Fetching paths...');

paths
    .then(function (res) {
        log.debug('Fetching paths done!');
        log.debug(`${Object.keys(res).length} paths fetched`);

        return Object.keys(res).reduce(
            function (sources, url) {
                const source = Object.assign({ url }, res[url]);

                return sources.concat(source);
            },
            []
        );
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
