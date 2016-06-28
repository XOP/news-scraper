import is from 'is';
import log from './log-wrapper.js';

const sectionTemplate = function(title, body) {
    if (!body) {
        log.error('No render body data. Check links params.');
        process.exit(1);
    }

    if (!is.string(title) || !is.string(body)) {
        log.error('title and body should be strings. Check links params.');
        process.exit(1);
    }

    return '' +
        '<section>' +
            '<h2>' + title + '</h2>' +
            '<article>' + body + '</article>' +
        '</section>';
};

export default sectionTemplate;
