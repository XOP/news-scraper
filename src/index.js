import fs from 'fs';
import path from 'path';

import is from 'is';

import scraper from './scraper';

import fetchPaths from './fetch-paths.js';
import renderPage from './render-page.js';
import renderIndex from './render-index.js';

import log from './utils/log-wrapper.js';
import sourceObjToArray from './utils/source-obj-to-array.js';

import cfg from '../config.js';

// launch params
// const debug = process.env.DEBUG;
const debugStage = process.env.STAGE;

// fixme: temp debug tool
const stageLog = (name, msg) => {
    if (debugStage) {
        log.info(name.toUpperCase());
        log.info('====================================');
        console.log(msg);
    }
};

// local sources
let localSrc = cfg.source.file;

if (!is.array(localSrc)) {
    localSrc = [localSrc];
}

let localSrcPath = localSrc.map(src => path.resolve(__dirname, cfg.source.path, src));

localSrcPath = localSrcPath.filter(src => {
    try {
        fs.readFileSync(src);
        return true;
    } catch (err) {
        return false;
    }
});

if (!localSrcPath.length) {
    log.warn('No local directives found');
}

log.debug('local src paths', localSrcPath);

// repo sources
let repoSrc = cfg.repo.file;

if (!is.array(repoSrc)) {
    repoSrc = [repoSrc];
}

let repoSrcPath = repoSrc.map(src => path.resolve(__dirname, cfg.source.path, cfg.repo.name, src));

repoSrcPath = repoSrcPath.filter(src => {
    try {
        fs.readFileSync(src);
        return true;
    } catch (err) {
        return false;
    }
});

if (!repoSrcPath.length) {
    log.warn('No repo directives found');
}

log.debug('repo src paths', repoSrcPath);

if (!localSrcPath.length && !repoSrcPath.length) {
    log.error('No directives found, exiting...');
    process.exit(1);
}

// fetch paths depending on the config
const paths = cfg.localOnly ?
    fetchPaths(localSrcPath) :
    fetchPaths(repoSrcPath, localSrcPath);

log.verbose('Fetching paths...');

const scrapeAndPublish = (stage) => {

    stageLog('local src paths', localSrcPath);
    stageLog('repo src paths', repoSrcPath);

    if (stage === 'paths') {
        return;
    }

    // preparing directives
    const sources = paths
            .then((res) => {
                log.verbose('Fetching paths done!');
                log.info(`${Object.keys(res).length} paths fetched`);

                log.debug('directives', res);
                stageLog('directives', res);

                return sourceObjToArray(res);
            })
            .catch(err => {
                log.error(err);
            });

    if (stage === 'sources') {
        return;
    }

    // scraping
    const scrapedData = sources
        .then(sources => scraper(sources, cfg, stage))
        .catch(err => {
            log.error(err);
        });

    // render the page
    const renderedPage = scrapedData
        .then(newData => {
            log.debug('new data', newData);
            stageLog('new data', newData);

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

scrapeAndPublish(debugStage);
