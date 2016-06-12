import path from 'path';

import log from './utils/log-wrapper.js';
import Promise from 'bluebird';

import cfg from '../config.js';

import fetchPaths from './fetch-paths.js';
import fetchPage from './fetch-page.js';
import parseData from './parse-data.js';
import renderOutput from './render-output.js';

import sourceObjToArray from './utils/source-obj-to-array.js';

const localSrcPath = path.resolve(__dirname, cfg.source.path, cfg.source.file);
const repoSrcPath = path.resolve(__dirname, cfg.source.path, cfg.repo.name, cfg.repo.file);

const paths = cfg.localOnly ?
    fetchPaths(localSrcPath) :
    fetchPaths(repoSrcPath, localSrcPath);

log.verbose('Fetching paths...');

paths
    .then((res) => {
        log.verbose('Fetching paths done!');
        log.info(`${Object.keys(res).length} paths fetched`);
        log.debug(res);

        return sourceObjToArray(res);
    })
    .then(sources => {
        log.debug('sources', sources);

        Promise.mapSeries(sources, fetchPage);
    })
    .then(scrapedData => {
        log.debug('scraped data', scrapedData);

        parseData(scrapedData);
    })
    .then(parsedData => {
        log.debug('parsed data', parsedData);

        renderOutput(parsedData);
    })
    .then(() => {
        log.info('Output render success!');
    })
    .catch(err => {
        log.error(err);
    });
