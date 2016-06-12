import is from 'is';
import log from './utils/log-wrapper.js';

const parseData = (data) => {
    if (!data) {
        log.error('No data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(data)) {
        log.error('Data type is not Array. Exiting...');
        process.exit(1);
    }

    let parseResult = data.reduce((arr, dataItem) => {
        let item = dataItem;

        if (is.array(dataItem)) {
            item = dataItem[0];
        }

        log.verbose(`New link parsed: ${item}`);

        return arr.concat(item);
    }, []);

    log.info('All links parsed!');

    return parseResult.join('<br/>');
};

export default parseData;
