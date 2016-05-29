import log from 'log-util';

import cfg from '../config.js';
import fetchList from './fetch-list.js';


//
// Fetching source list

log.info('Fetching source list...');

const list = fetchList(cfg.list);

list.then(function (response) {
    log.debug(response);

    log.info('Fetching source list done!');
});

