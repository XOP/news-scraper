import is from 'is';

import itemTemplate from './item-tpl.js';

import log from './../utils/log-wrapper.js';

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
        (initialBody, dataItem) => initialBody.concat(itemTemplate(dataItem)),
        []
    ).join('');

    return '' +
        '<section class="news-section">' +
            '<div class="news-section__heading">' +
                '<h2 class="heading heading--2">' + title + '</h2>' +
            '</div>' +
            '<div class="news-section__url">' + url + '</div>' +
            '<div class="news-section__content">' + body + '</div>' +
        '</section>';
});

export default sectionTemplate;
