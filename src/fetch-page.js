import log from './utils/log-wrapper.js';
import Promise from 'bluebird';
import { remote } from 'webdriverio';

const wdioOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

const fetchPage = props => {
    log.verbose(`Fetching page content from ${props.url}...`);
    log.debug('props', props);

    const browser = remote(wdioOptions);

    // todo: catch browser errors
    return new Promise((resolve) => browser
        .init()
        .url(props.url)
        .getHTML(props.elem, true).then(data => {
            log.verbose(`Fetching page content from ${props.url} done!`);
            log.info(`${data.length} links scraped`);
            log.debug('data', data);

            props.data = data;
            resolve(props);
        })
        .end()
    );
};

export default fetchPage;
