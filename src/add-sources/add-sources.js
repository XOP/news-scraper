import path from 'path';

import prompt from 'prompt';

import log from '../utils/log-wrapper.js';

import cfg from '../../config.js';

import schemaTpl from './schema.js';
import writeResult from './write-result.js';

const schema = schemaTpl(cfg);
const customFilename = 'custom';
const filePath = (fileName = customFilename) => ({
    path: path.resolve(__dirname, cfg.source.path, `${fileName}.json`),
    name: fileName
});

log.verbose('Starting sources fill dialog...');

prompt.start();

let newSources = {};

const addSourceDialog = () => {
    prompt.get(schema, (err, result) => {
        if (err) {
            log.error(err);
            return;
        }

        log.verbose('New Source has been added:');

        const title = result.title;
        const url = result.url;
        const elem = result.elem;
        const limit = result.limit;

        log.info('\n' +
            title + '\n' +
            '    ' + 'url: ' + url + '\n' +
            '    ' + 'elem: ' + elem + '\n' +
            '    ' + 'limit: ' + limit
        );

        newSources[title] = {
            url,
            elem,
            limit
        };

        prompt.get({
            properties: {
                'add another source? y/n': {
                    type: 'string',
                    required: true,
                    message: 'Add another source? Type "y" or "n"',
                    conform: value => value === 'y' || value === 'n'
                }
            }
        }, (err, result) => {
            if (err) {
                log.error(err);
                return;
            }

            if (result['add another source? y/n'] === 'y') {
                addSourceDialog();
            } else {
                log.info('Number of sources added: ' + Object.keys(newSources).length);

                writeResult(newSources, filePath());

                // end dialog
                return false;
            }
        });
    });
};

export default addSourceDialog;
