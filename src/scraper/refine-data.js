import is from 'is';
import cheerio from 'cheerio';

import { domainRegexp } from './helpers/regexp.js';

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

    const refinedData = pages.reduce(
        (initialData, page) => {
            // extract domain from url
            let pageUrlDomain = page.url.match(domainRegexp);

            if (!pageUrlDomain) {
                log.warn(`Cannot refine url: ${page.url}`);
                log.debug('refined url', pageUrlDomain);

                // try something
                pageUrlDomain = page.url;
            } else {
                pageUrlDomain = pageUrlDomain[0];
            }

            // extract protocol from url
            const pageUrlProtocol = page.url.split('://')[0];

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

                    if (href.indexOf('//') === 0) {
                        // protocol link
                        href = `${pageUrlProtocol}:${href}`;
                    } else {
                        // relative link
                        const firstUrlChar = href.charAt(0);

                        if (firstUrlChar === '/' || firstUrlChar === '#') {
                            href = pageUrlDomain + href;
                        }
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

                    if (image.length) {
                        let imageSrc = image.attr('src');

                        if (!imageSrc) {
                            imageSrc = image.attr('data-src'); // todo: test case
                        }

                        if (!imageSrc) {
                            imageSrc = image.css('background-image'); // todo: test case

                            if (imageSrc) {
                                // extract src from pattern 'url(src)'
                                imageSrc = imageSrc.slice(4, -1);
                            }
                        }

                        if (imageSrc) {
                            if (imageSrc.indexOf('//') === 0) {
                                // protocol link
                                imageSrc = `${pageUrlProtocol}:${imageSrc}`;
                            } else {
                                // relative link
                                const firstImageSrcChar = imageSrc.charAt(0);

                                if (firstImageSrcChar === '/' || firstImageSrcChar === '#') {
                                    imageSrc = pageUrlDomain + imageSrc;
                                }
                            }

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

    return {
        meta: {},
        pages: refinedData
    };
};

export default refineData;
