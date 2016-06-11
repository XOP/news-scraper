import log from 'log-util';
import Promise from 'bluebird';
import { remote } from 'webdriverio';

const wdioOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

const fetchList = props => {
    log.info(`Fetching page content from ${props.url}...`);

    const browser = remote(wdioOptions);

    return new Promise((resolve) => browser
        .init()
        .url(props.url)
        .getHTML(props.link, true).then(data => {
            log.debug(`Fetching page content from ${props.url} done!`);

            resolve(data);
        })
        .end()
    );
};

export default fetchList;
