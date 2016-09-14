import fs from 'fs-extra';
import path from 'path';

import log from './utils/log-wrapper';

import renderPage from './render-page.js';

import cfg from '../config.js';

const renderPages = (outputPath, outputExt) => {
    const fileNames = fs.readdirSync(outputPath);

    if (!fileNames.length) {
        log.warn('Output directory is empty!');

        return;
    }

    const dataFileNames = fileNames.filter(fileName => fileName.indexOf('json') > -1);

    if (!dataFileNames.length) {
        log.warn('No data (json) files in the output directory!');

        return;
    }

    let counter = 0;

    dataFileNames.forEach(fileName => {
        const outputFileName = fileName.replace('json', outputExt);
        const fileData = fs.readJsonSync(path.join(outputPath, fileName));

        renderPage(
            fileData,
            path.join(outputPath, outputFileName)
        );

        if (++counter === dataFileNames.length) {
            log.info('Rendering pages success!');
        }
    });
};

log.info('Rendering pages...');

renderPages(cfg.output.path, cfg.output.fileExt);
