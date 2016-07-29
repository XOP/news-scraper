import path from 'path';

import is from 'is';
import Promise from 'bluebird';

import fetchPaths from './fetch-paths.js';
import fetchPage from './fetch-page.js';
import limitData from './limit-data.js';
import refineData from './refine-data.js';
import compareData from './compare-data.js';
import renderPage from './render-page.js';
import renderIndex from './render-index.js';

import log from './utils/log-wrapper.js';
import sourceObjToArray from './utils/source-obj-to-array.js';

import cfg from '../config.js';

// launch params
const debug = process.env.DEBUG;
const debugStage = debug && process.env.STAGE;

// local sources
let localSrc = cfg.source.file;

if (!is.array(localSrc)) {
    localSrc = [localSrc];
}

const localSrcPath = localSrc.map(src => path.resolve(__dirname, cfg.source.path, src));

log.debug('loca src paths', localSrcPath);

// repo sources
let repoSrc = cfg.repo.file;

if (!is.array(repoSrc)) {
    repoSrc = [repoSrc];
}

const repoSrcPath = repoSrc.map(src => path.resolve(__dirname, cfg.source.path, cfg.repo.name, src));

log.debug('repo src paths', repoSrcPath);

// fetch paths depending on the config
const paths = cfg.localOnly ?
    fetchPaths(localSrcPath) :
    fetchPaths(repoSrcPath, localSrcPath);

log.verbose('Fetching paths...');

const scraper = (stage) => {

    if (stage === 'paths') {
        return;
    }

    // preparing directives
    const sources = paths
            .then((res) => {
                log.verbose('Fetching paths done!');
                log.info(`${Object.keys(res).length} paths fetched`);

                log.debug('directives', res);

                return sourceObjToArray(res);
            })
            .catch(err => {
                log.error(err);
            });

    if (stage === 'sources') {
        return;
    }

    // scraping data
    const scrapedData = sources
            .then(sources => {
                log.debug('sources', sources);

                return Promise.mapSeries(sources, fetchPage);
            })
            .catch(err => {
                log.error(err);
            });

    if (stage === 'data') {
        return;
    }

    // limit the data
    const limitedData = scrapedData
        .then(scrapedData => {
            log.debug('scraped data', scrapedData);

            return limitData(scrapedData, cfg.limit);
        })
        .catch(err => {
            log.error(err);
        });

    if (stage === 'limit') {
        return;
    }

    // refine the data
    const refinedData = limitedData
        .then(limitedData => {
            log.debug('limited data', limitedData);

            return refineData(limitedData);
        })
        .catch(err => {
            log.error(err);
        });

    if (stage === 'refine') {
        return;
    }

    // compare to previous data
    const currentData = refinedData
        .then(refinedData => {
            log.debug('refined data', refinedData);

            return compareData(refinedData);
        })
        .catch(err => {
            log.error(err);
        });

    if (stage === 'compare') {
        return;
    }

    // render the page
    const renderedPage = currentData
        .then(newData => {
            log.debug('new data', newData);

            return renderPage(newData);
        })
        .catch(err => {
            log.error(err);
        });

    if (stage === 'render') {
        return;
    }

    // render the index
    renderedPage
        .then((renderStatus) => {
            if (renderStatus !== false) {
                log.info('Page render success!');

                return renderIndex(cfg.output.path);
            } else {
                return false;
            }
        })
        .then((renderStatus) => {
            if (renderStatus !== false) {
                log.info('Index render success!');
            } else {
                return false;
            }
        })
        .catch(err => {
            log.error(err);
        });
};

scraper(debugStage);
