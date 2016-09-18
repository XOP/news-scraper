import { urlRegexp } from '../helpers/regexp.js';

const schema = cfg => ({
    properties: {
        title: {
            type: 'string',
            message: 'Title of the source',
            required: true
        },

        url: {
            type: 'string',
            pattern: urlRegexp,
            message: 'Please enter valid url,\ne.g. "http://www.news.com/articles"',
            required: true
        },

        elem: {
            type: 'string',
            message: 'Please enter valid CSS selector for the <a>...</a> element, e.g. "#content .articles > .post li h3 > a"',
            required: true
        },

        limit: {
            type: 'number',
            message: `Please specify maximum number of links to parse. The default is ${cfg.limit}, the possible maximum is ${cfg.absLimit}`,
            required: false,
            conform: value => {
                if (typeof value === 'number') {
                    return value < cfg.absLimit;
                } else {
                    return false;
                }
            }
        }
    }
});

export default schema;
