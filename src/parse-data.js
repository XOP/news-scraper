//import fs from 'fs';
//import path from 'path';

import is from 'is';
import log from 'log-util';

const parseData = (data) => {
    if (!data) {
        log.error('No data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(data)) {
        log.error('Data type is not Array. Exiting...');
        process.exit(1);
    }

    console.log(data);

    let parseResult = data.reduce((arr, dataItem) => {
        let item = dataItem;

        if (is.array(dataItem)) {
            item = dataItem[0]; // todo: limit
        }

        return arr.concat(item);
    }, []);

    console.log(parseResult);

    return parseResult;
};

export default parseData;
