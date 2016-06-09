import path from 'path';

import log from 'log-util';
import Promise from 'bluebird';

import cfg from '../config.js';

import fetchPaths from './fetch-paths.js';
import fetchPage from './fetch-page.js';
import parseData from './parse-data.js';

import sourceObjToArray from './utils/source-obj-to-array.js';

const localSrcPath = path.resolve(__dirname, cfg.source.path, cfg.source.file);
const repoSrcPath = path.resolve(__dirname, cfg.source.path, cfg.repo.name, cfg.repo.file);

const paths = fetchPaths(localSrcPath, repoSrcPath);

log.info('Fetching paths...');

paths
    .then(function (res) {
        log.debug('Fetching paths done!');
        log.debug(`${Object.keys(res).length} paths fetched`);

        return sourceObjToArray(res);
    })
    .then(function (sources) {
        return Promise.mapSeries(
            sources,
            fetchPage
        );
    })
    .then(function (scrapedData) {
        console.log(scrapedData);
        console.log(typeof scrapedData);

        //return scrapedData.map(parseData);
    })
    .catch(function (err) {
        log.error(err);
    });
