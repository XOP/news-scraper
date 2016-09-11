import is from 'is';

import log from './utils/log-wrapper.js';

import _intersectionBy from 'lodash.intersectionby';
import _differenceBy from 'lodash.differenceby';
import _isEqual from 'lodash.isequal';

const filterData = (newData, currentData) => {
    if (!currentData) {
        log.error('No data provided. Check filterData params.');
        process.exit(1);
    }

    if (!is.array(currentData) || !is.array(newData)) {
        log.error('Data type is not Array. Exiting...');
        process.exit(1);
    }

    let filteredData = [];
    let commonData = [];

    log.verbose('Data is being filtered...');

    if (_isEqual(newData, currentData)) {
        // if objects are identical
        // there is no data
        filteredData = null;
    } else {
        filteredData = _differenceBy(newData, currentData, 'title');
        commonData = _intersectionBy(newData, currentData, 'title');

        if (!commonData.length) {
            // if there is no common items
            // all data is new
            filteredData = newData;
        } else {
            // if there is common items by title
            // they have to be compared by data
            currentData.forEach(currentItem => {
                newData.forEach(newItem => {
                    if (newItem.title === currentItem.title) {
                        const differentData = _differenceBy(newItem.data, currentItem.data, 'href');

                        if (differentData.length) {
                            filteredData = filteredData.concat({
                                title: newItem.title,
                                url: newItem.url,
                                data: differentData
                            });
                        }
                    }
                });
            });
        }
    }

    log.debug('filtered data', filteredData);
    log.verbose('Data has been filtered!');

    return filteredData;
};

export default filterData;
