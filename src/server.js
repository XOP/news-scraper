import path from 'path';

import Hapi from 'hapi';
import vision from 'vision';
import handlebars from 'handlebars';

// fixme: move to global modules
import scraper from './scraper';

import log from './utils/log-wrapper';
import parseFile from './utils/parse-file.js';

import cfg from '../config';

const mockDirectives = [
    {
        url: 'https://www.smashingmagazine.com',
        elem: 'article.post',
        link: 'h2 > a',
        author: 'h2 + ul li.a a',
        time: 'h2 + ul li.rd',
        image: 'figure > a > img',
        limit: 6
    }
];

const server = new Hapi.Server();

const root = path.resolve(__dirname, '../');
const paths = {
    templates: path.resolve(root, 'templates'),
    data: path.resolve(root, 'data'),
    resources: path.resolve(root, 'data.json')
};

const resources = parseFile(paths.resources);

server.connection({
    port: 9000,
    host: 'localhost'
});

server.register(vision, (err) => {

    if (err) {
        log.error(err);
    }

    server.views({
        engines: {
            hbs: handlebars
        },
        path: paths.templates,
        layout: 'layout',
        layoutPath: path.join(paths.templates, 'layout'),
        partialsPath: path.join(paths.templates, 'partials'),
        context: {
            meta: resources.meta,
            header: resources.header,
            footer: resources.footer
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            const ctx = Object.assign({}, {
                header: {
                    heading: 'Index'
                }
            });

            reply.view('index', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/news/{id}',
        handler: function (request, reply) {
            const timestamp = request.params.id;
            const fileName = `${timestamp}.json`;

            const pageData = parseFile(path.join(paths.data, fileName));

            const ctx = Object.assign({}, pageData, {
                header: {
                    heading: 'News'
                }
            });

            reply.view('news', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/scraper',
        handler: function (request, reply) {
            const data = scraper(mockDirectives, cfg)
                .then(function (data) {
                    return data;
                })
                .catch(function (err) {
                    return err;
                });

            return reply(data);
        }
    });
});

server.start((err) => {
    if (err) {
        throw err;
    }

    log.info(`Server running at: ${server.info.uri}`);
});
