import is from 'is';
import cheerio from 'cheerio';

import log from './utils/log-wrapper.js';

const refineData = (pages) => {
    if (!pages) {
        log.error('No pages data provided. Check parseData params.');
        process.exit(1);
    }

    if (!is.array(pages)) {
        log.error('Pages type is not Array. Exiting...');
        process.exit(1);
    }

    log.verbose('Refining data...');

    // Regular Expression for URL validation
    // Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
    // https://gist.github.com/dperini/729294
    const domainRegexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)/i;

    const refinedData = pages.reduce(
        (initialData, page) => {
            page.data = page.data.reduce(
                (arr, data) => {
                    const $ = cheerio.load(data);

                    // parsing link
                    let a = page.link ? $(page.link) : $('a');

                    // choose first link if multiple occur
                    if (a.length > 1) {
                        a = a.eq(0);
                    }

                    let href = a.attr('href');

                    // no href found
                    if (!href) {
                        log.warn(`Link parsed, but no href found: ${data} @ ${page.url}`);
                        log.debug('missing href', data);

                        return arr;
                    }

                    // relative link
                    const firstChar = href.charAt(0);

                    if (firstChar === '/' || firstChar === '#') {
                        let pageUrlDomain = page.url.match(domainRegexp);

                        if (!pageUrlDomain) {
                            log.warn(`Cannot refine url: ${page.url}`);
                            log.debug('refined url', pageUrlDomain);

                            // try something
                            pageUrlDomain = page.url;
                        } else {
                            pageUrlDomain = pageUrlDomain[0];
                        }

                        href = pageUrlDomain + href;
                    }

                    // creating props object
                    const parsedProps = {
                        href: href,
                        text: a.text() || '',
                        title: a.attr('title') || '',
                        raw: data
                    };

                    // parsing author
                    const author = $(page.author);

                    if (author && author.text()) {
                        parsedProps.author = author.text();
                    }

                    // parsing time
                    const time = $(page.time);

                    if (time && time.text()) {
                        parsedProps.time = time.text();
                    }

                    // parsing image src
                    const image = $(page.image);

                    if (image) {
                        let imageSrc = image.attr('src');

                        if (!imageSrc) {
                            imageSrc = image.attr('data-src'); // todo: test case
                        }

                        if (imageSrc) {
                            parsedProps.imageSrc = imageSrc;
                        }
                    }

                    return arr.concat(parsedProps);
                },
                []
            );

            log.debug('refined data', page.data);

            return initialData.concat(page);
        },
        []
    );

    log.verbose('Refining operation complete');

    return refinedData;
};

export default refineData;
