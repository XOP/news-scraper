import Promise from 'bluebird';
import Nightmare from 'nightmare';

import log from './utils/log-wrapper.js';

const nightmareOptions = {};

const fetchPage = props => {
    log.verbose(`Fetching page content from ${props.url}...`);
    log.debug('props', props);

    const nightmare = Nightmare(nightmareOptions); // eslint-disable-line

    return new Promise((resolve) => nightmare
        .goto(props.url)
        .evaluate((props) => {
            const nodeData = document.querySelectorAll(props.elem);
            const stringData = Array.prototype.map.call(nodeData, dataItem => dataItem.outerHTML);

            return stringData;
        }, props)
        .end()
        .then(data => {
            log.verbose(`Fetching page content from ${props.url} done!`);
            log.info(`${props.url}: ${data.length} links scraped`);
            log.debug('data', data);

            props.data = data;
            resolve(props);

            return data;
        })
        .catch(err => {
            log.warn(`Oops, something happened: ${err}`);
            log.warn(`${props.url}: ${err.message}`);
            log.info(`${props.url}: 0 links scraped`);

            props.data = [];
            resolve(props);
        })
    );
};

export default fetchPage;
