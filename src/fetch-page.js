import log from 'log-util';
import Promise from 'bluebird';
import { remote } from 'webdriverio';

const wdioOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

const browser = remote(wdioOptions);

const fetchList = function (props) {
    return new Promise(function(resolve){
        browser
            .init()
            .url(props.url)
            .getHTML(props.elem, false).then(function (data) {
                resolve(data);
            })
            .end();
    });
};

export default fetchList;
