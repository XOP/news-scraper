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
            const newsItem = '' +
                '<a class="news-item" href="' + dataItem.href + '" title="' + dataItem.title + '" target="_blank">' +
                    (
                        dataItem.imageSrc ?
                        '<img class="news-item__image" src="' + dataItem.imageSrc + '" width="100" />' : ''
                    ) +
                    '<div class="news-item__text">' + dataItem.text + '</div>' +
                    (
                        dataItem.author ?
                        '<div class="news-item__author">author: ' + dataItem.author + '</div>' : ''
                    ) +
                    (
                        dataItem.time ?
                        '<div class="news-item__date">date: ' + dataItem.time + '</div>' : ''
                    ) +
                '</a>';

            return initialBody.concat(newsItem);
        },
        []
    ).join('');

    return '' +
        '<section class="news-section">' +
            '<h2 class="news-section__heading">' + title + '</h2>' +
            '<h3 class="news-section__url">' + url + '</h3>' +
            '<article class="news-section__content">' + body + '</article>' +
        '</section>';
});

export default sectionTemplate;
