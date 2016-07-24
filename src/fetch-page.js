import is from 'is';
import Promise from 'bluebird';
import { remote } from 'webdriverio';

import log from './utils/log-wrapper.js';

const wdioOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

const fetchPage = props => {
    log.verbose(`Fetching page content from ${props.url}...`);
    log.debug('props', props);

    const browser = remote(wdioOptions);

    return new Promise((resolve) => browser
        .init()
        .url(props.url)
        .getHTML(props.elem, true).then(data => {
            log.verbose(`Fetching page content from ${props.url} done!`);
            log.info(`${props.url}: ${data.length} links scraped`);
            log.debug('data', data);

            if (!is.array(data)) {
                data = [data];
            }

            props.data = data;
            resolve(props);

            return data;
        })
        .catch(err => {
            log.warn(`${props.url}: ${err.message}`);
            log.info(`${props.url}: 0 links scraped`);

            props.data = [];
            resolve(props);
        })
        .end()
    );
};

export default fetchPage;
