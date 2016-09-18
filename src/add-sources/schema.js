import { urlRegexp } from '../helpers/regexp.js';

const schema = cfg => ({
    properties: {
        title: {
            description: 'title, required',
            type: 'string',
            message: 'Title of the source, e.g. "A List Apart"',
            required: true
        },

        url: {
            description: 'url, required',
            type: 'string',
            pattern: urlRegexp,
            message: 'Valid url,\ne.g. "http://www.news.com/articles"',
            required: true
        },

        elem: {
            description: 'elem, required',
            type: 'string',
            message: 'CSS selector for the news item element, e.g. "#content .articles > .post"',
            required: true
        },

        link: {
            description: 'link, optional',
            type: 'string',
            message: 'CSS selector for the "a" element relative to item root, e.g. "h3 > a"',
            required: false
        },

        author: {
            description: 'author, optional',
            type: 'string',
            message: 'CSS selector for the element containing author data, relative to item root, e.g. "div.author"',
            required: false
        },

        time: {
            description: 'time, optional',
            type: 'string',
            message: 'CSS selector for the element containing post date, relative to item root, e.g. "span.date"',
            required: false
        },

        image: {
            description: 'image, optional',
            type: 'string',
            message: 'CSS selector for the img element or the element containing background image, relative to item root, e.g. "img.post__image" or "div.image"',
            required: false
        },

        limit: {
            description: 'limit, optional',
            type: 'number',
            message: `Maximum number of links to parse. The default is ${cfg.limit}, the possible maximum is ${cfg.absLimit}`,
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
