import is from 'is';

import log from './log-wrapper.js';

const sectionTemplate = (page => {
    const {
        title,
        url,
        data
        } = page;

    if (!data) {
        log.error('No page data. Check sectionTemplate params.');
        process.exit(1);
    }

    if (!is.array(data)) {
        log.error('Data type is not Array. Check sectionTemplate params.');
        process.exit(1);
    }

    const body = data.reduce(
        (initialBody, dataItem) => {
            const link = '' +
                '<a href="' + dataItem.href + '" title="' + dataItem.title + '" target="_blank">' +
                    dataItem.text +
                '</a>';

            return initialBody.concat(link);
        },
        []
    ).join('');

    return '' +
        '<section>' +
            '<h2>' + title + '</h2>' +
            '<h3>' + url + '</h3>' +
            '<article>' + body + '</article>' +
        '</section>';
});

export default sectionTemplate;
