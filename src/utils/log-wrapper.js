import log from 'log-util';
import cfg from '../../config.js';

let logWrapper = {
    info: (msg) => log.info(msg),
    verbose: (msg) => log.verbose(msg),
    warn: (msg) => log.warn(msg),
    debug: (name, msg) => {
        log.debug('debug start -----------------');

        if (msg) {
            console.log(`${name}: `);
            console.log(msg);
        } else {
            console.log(name);
        }

        log.debug('debug end -------------------');
    },
    error: (msg) => log.error(msg)
};

if (!cfg.debug) {
    logWrapper.debug = () => null;
}

if (cfg.silent) {
    logWrapper.verbose = () => null;
    logWrapper.info = () => null;
    logWrapper.warn = () => null;
}

export default logWrapper;