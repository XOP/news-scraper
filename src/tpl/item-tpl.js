import log from '../utils/log-wrapper.js';

const itemTemplate = (dataItem => {
    if (!dataItem) {
        log.error('No dataItem. Check itemTemplate params.');
        process.exit(1);
    }

    return '' +
        '<article class="news-item">' +
            '<a class="news-item__link" href="' + dataItem.href + '" title="' + dataItem.title + '" target="_blank">' +
                (
                    dataItem.imageSrc ? (
                        '<figure class="news-item__image">' +
                            '<img class="news-item__image__pic" src="' + dataItem.imageSrc + '" width="100" />' +
                        '</figure>'
                    ) : ''
                ) +
                '<div class="news-item__heading">' +
                    '<h3 class="heading heading--3">' + dataItem.text + '</h3>' +
                '</div>' +
                (
                    dataItem.author ?
                    '<div class="news-item__author">author: ' + dataItem.author + '</div>' : ''
                ) +
                (
                    dataItem.time ?
                    '<div class="news-item__date">date: ' + dataItem.time + '</div>' : ''
                ) +
            '</a>' +
        '</article>';
});

export default itemTemplate;
