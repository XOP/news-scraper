import path from 'path';
import fs from 'fs-extra';

import Hapi from 'hapi';
import vision from 'vision';
import handlebars from 'handlebars';

import scraper from 'news-scraper-core';

import log from './utils/log-wrapper';
import parseFile from './utils/parse-file.js';
import { getDate, getTime} from './utils/date-utils.js';

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
    data: cfg.output.path,
    publish: cfg.publish.path,
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
            hbs: {
                module: handlebars
            }
        },
        path: paths.templates,
        layout: 'layout',
        layoutPath: path.join(paths.templates, 'layout'),
        partialsPath: path.join(paths.templates, 'partials'),
        context: resources
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            const ctx = {
                header: Object.assign({}, resources.header, {
                    heading: 'Index',
                    link: false
                }),
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
            };

            reply.view('index', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/news',
        handler: function (request, reply) {
            let newsFiles = fs.readdirSync(paths.data);

            newsFiles = newsFiles.filter(item => item.indexOf('.json') > -1);
            newsFiles = newsFiles.map(fileName => {
                const timestamp = +fileName.split('.json')[0];
                const href = `/news/${timestamp}`;
                const timeDate = renderTimeDate(timestamp);

                const fileData = parseFile(path.join(paths.data, fileName));
                const titles = fileData.pages.reduce((init, page) => {
                    return page.title && init.concat(page.title);
                }, []);

                let someTitles = titles && titles.slice(0, 3);
                let titlePostfix = ' ';

                if (someTitles && someTitles.length) {
                    someTitles = someTitles.join(', ');

                    if (titles.length > 3) {
                        titlePostfix = '...' + titlePostfix;
                    }
                }

                if (!href || !someTitles) {
                    return false;
                }

                return {
                    href,
                    name: `${someTitles}${titlePostfix} / ${timeDate}`
                };
            });

            const ctx = {
                header: Object.assign({}, resources.header, {
                    heading: 'News Directory'
                }),
                latest: newsFiles,
                others: null
            };

            reply.view('directory', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/news/{id}',
        handler: function (request, reply) {
            const timestamp = request.params.id;
            const fileName = `${timestamp}.json`;
            const timeDate = renderTimeDate(timestamp);

            const pageData = parseFile(path.join(paths.data, fileName));

            const ctx = Object.assign({}, pageData, {
                header: Object.assign({}, resources.header, {
                    heading: `News for ${timeDate}`
                })
            });

            reply.view('news', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/scraper',
        handler: function (request, reply) {
            const ctx = {
                header: Object.assign({}, resources.header, {
                    heading: 'Scraper'
                }),
                scripts: ['main']
            };

            reply.view('scraper', ctx);
        }
    });

    server.route({
        method: 'GET',
        path: '/scraper/new',
        handler: function (request, reply) {

            // todo: use real data
            const data = scraper(mockDirectives, cfg);

            let ctx = Object.assign({}, data, {
                header: Object.assign({}, resources.header, {
                    heading: 'Scraping result'
                })
            });

            return data.then(data => {
                ctx = Object.assign(ctx, data);

                reply.view('news', ctx);
            });
        }
    });
});

server.start((err) => {
    if (err) {
        throw err;
    }

    log.info(`Server running at: ${server.info.uri}`);
});

function renderTimeDate (timestamp) {
    timestamp = +timestamp;

    const date = getDate(timestamp);
    const time = getTime(timestamp);

    return `${date} [${time}]`;
}
