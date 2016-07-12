import path from 'path';

import is from 'is';
import Promise from 'bluebird';

import fetchPaths from './fetch-paths.js';
import fetchPage from './fetch-page.js';
import limitData from './limit-data.js';
import refineData from './refine-data.js';
import renderPage from './render-page.js';
import renderIndex from './render-index.js';

import log from './utils/log-wrapper.js';
import sourceObjToArray from './utils/source-obj-to-array.js';

import cfg from '../config.js';

// local sources
let localSrc = cfg.source.file;

if (!is.array(localSrc)) {
    localSrc = [localSrc];
}

const localSrcPath = localSrc.map(src => path.resolve(__dirname, cfg.source.path, src));

// repo sources
let repoSrc = cfg.repo.file;

if (!is.array(repoSrc)) {
    repoSrc = [repoSrc];
}

const repoSrcPath = repoSrc.map(src => path.resolve(__dirname, cfg.source.path, cfg.repo.name, src));

// fetch paths depending on the config
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

        return Promise.mapSeries(sources, fetchPage);
    })
    .then(scrapedData => {
        log.debug('scraped data', scrapedData);

        return limitData(scrapedData, cfg.limit);
    })
    .then(limitedData => {
        log.debug('limited data', limitedData);

        return refineData(limitedData);
    })
    .then(refinedData => {
        log.debug('refined data', refinedData);

        return renderPage(refinedData);
    })
    .then(() => {
        log.info('Page render success!');

        return renderIndex(cfg.output.path);
    })
    .then(() => {
        log.info('Index render success!');
    })
    .catch(err => {
        log.error(err);
    });
