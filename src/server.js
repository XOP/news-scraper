import path from 'path';

import Hapi from 'hapi';
import vision from 'vision';
import handlebars from 'handlebars';

import scraper from 'news-scraper-core';

import log from './utils/log-wrapper';
import parseFile from './utils/parse-file.js';
import deepAssign from 'deep-assign';

import cfg from '../config';

const mockDirectives = [
    {
        url: 'https://www.smashingmagazine.com',
        title: 'Smashing Magazine',
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
        context: resources,
        isCached: false
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            const ctx = deepAssign(resources, {
                header: {
                    heading: 'Index',
                    link: false
                },
                links: [
                    {
                        href: '/scraper',
                        name: 'Scraper'
                    },
                    {
                        href: '/news',
                        name: 'News Directory'
                    }
                ]
            });

            reply.view('index', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/news',
        handler: function (request, reply) {
            const ctx = deepAssign(resources, {
                header: {
                    heading: 'News Index'
                }
            });

            reply.view('news', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/news/{id}',
        handler: function (request, reply) {
            const timestamp = request.params.id;
            const fileName = `${timestamp}.json`;

            const pageData = parseFile(path.join(paths.data, fileName));

            const ctx = deepAssign(resources, pageData, {
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
            const data = scraper(mockDirectives, cfg);

            return data.then(data => reply.view('news', data));
        }
    });
});

server.start((err) => {
    if (err) {
        throw err;
    }

    log.info(`Server running at: ${server.info.uri}`);
});
