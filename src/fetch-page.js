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
    log.debug(`props: ${props}`);

    const browser = remote(wdioOptions);

    return new Promise((resolve) => browser
        .init()
        .url(props.url)
        .getHTML(props.link, true).then(data => {
            log.verbose(`Fetching page content from ${props.url} done!`);
            log.debug(`data: ${data}`);

            resolve(data);
        })
        .end()
    );
};

export default fetchPage;
