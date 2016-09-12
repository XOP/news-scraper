import is from 'is';
import log from 'log-util';

const debug = process.env.DEBUG;

console.log('DEBUG mode', (debug ? 'ON' : 'OFF'));

let logWrapper = {
    info: (msg) => log.info(msg),
    verbose: (msg) => log.verbose(msg),
    warn: (msg) => log.warn(msg),
    debug: (name, ...msg) => {
        log.debug('debug start -----------------');

        if (msg) {
            console.log(`${name}: `);

            if (is.array(msg)) {
                msg.forEach(i => console.log(i));
            } else {
                console.log(msg);
            }
        } else {
            console.log(name);
        }

        log.debug('debug end -------------------');
    },
    error: (msg) => log.error(msg)
};

if (!debug) {
    logWrapper.debug = () => null;
}

export default logWrapper;
