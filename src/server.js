import path from 'path';
import fs from 'fs-extra';
import is from 'is';

import Hapi from 'hapi';
import inert from 'inert';
import vision from 'vision';
import nes from 'nes';
import handlebars from 'handlebars';

import Scraper from 'news-scraper-core';

import log from './utils/log-wrapper';
import parseFile from './utils/parse-file.js';
import { getDate, getTime} from './utils/date-utils.js';

import formatDirectives from './server/format-directives.js';

import cfg from '../config';
import pkg from '../package.json';

const server = new Hapi.Server();

const root = path.resolve(__dirname, '../');
const paths = {
    templates: path.resolve(root, 'templates'),
    data: cfg.output.path,
    publish: cfg.publish.path,
    resources: path.resolve(root, 'data.json'),
    repoDirectives: path.join(cfg.source.path, cfg.repo.name),
    localDirectives: path.join(cfg.source.path, cfg.local.path)
};

// requesting resources
const resources = parseFile(paths.resources);

// extending with dynamic data
resources.header.version = pkg.version;

// connect
server.connection({
    port: 9000,
    host: 'localhost'
});

// custom events
server.event('scrapingCancel');

const eventMap = {
    scrapingCancel: {
        response: 'Scraping process cancelled'
    }
};

// custom events callback
const eventsNormalize = (event, cb) => {
    const response = eventMap[event].response;

    server.emit(event, response);
    cb(response);
};

// plugins and routes
server.register([
    {
        register: vision // template support
    },
    {
        register: inert // static assets serving
    },
    {
        register: nes, // websockets implementation (same for client)
        options: {
            onMessage: (socket, message, next) => {
                eventsNormalize(message, next);
            },

            onConnection: () => {
                log.verbose('Socket connected');
            },

            onDisconnection: () => {
                log.verbose('Socket disconnnected');
            }
        }
    }
], (err) => {

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

    // static assets
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                index: false,
                path: paths.publish
            }
        }
    });

    // data
    server.route({
        method: 'GET',
        path: '/data/{param*}',
        handler: {
            directory: {
                index: false,
                path: paths.data,
                defaultExtension: 'json'
            }
        }
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
            newsFiles = newsFiles.reverse(); // later (newest) first
            newsFiles = newsFiles.map(fileName => {
                const timestamp = +fileName.split('.json')[0];
                const href = `/news/${timestamp}`;
                const timeDate = renderTimeDate(timestamp);

                const fileData = parseFile(path.join(paths.data, fileName));

                const titles = fileData.pages && fileData.pages.reduce((init, page) => {
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

            const repoDirectives = cfg.repo.use && formatDirectives(paths.repoDirectives);
            const localDirectives = cfg.local.use && formatDirectives(paths.localDirectives);

            ctx.directives = [];

            if (repoDirectives && repoDirectives.length) {
                ctx.directives = ctx.directives.concat(repoDirectives);
            }

            if (localDirectives && localDirectives.length) {
                ctx.directives = ctx.directives.concat(localDirectives);
            }

            reply.view('scraper', ctx);
        }
    });

    server.route({
        method: 'POST',
        path: '/scraper',
        handler: function (request, reply) {
            const payload = request.payload;

            const rawInput = payload.directives;
            const userCfg = JSON.parse(payload.userCfg);
            const parsedInput = JSON.parse(rawInput);
            const wrappedInput = is.array(parsedInput) ? parsedInput : [parsedInput];

            const newScraper = new Scraper(wrappedInput, Object.assign(cfg, userCfg));

            const scraperEvents = newScraper.events;
            const scraperData = newScraper.data;

            scraperEvents.on('scrapingStart', msg => broadcast(msg, 'scrapingStart'));
            scraperEvents.on('scrapingEnd', msg => broadcast(msg, 'scrapingEnd'));
            scraperEvents.on('scrapingError', msg => broadcast(msg, 'scrapingError'));

            server.on('scrapingCancel', (msg) => {
                newScraper.state = 'abort';

                scraperEvents.removeAllListeners('scrapingStart');
                scraperEvents.removeAllListeners('scrapingEnd');

                broadcast(msg, 'scrapingAbort');
            });

            scraperData.then(data => {
                const newsId = data.meta.date;
                const state = newScraper.state;

                if (state === 'abort') {
                    broadcast('Cancelling...');

                    setTimeout(() => {
                        reply(data)
                            .header('X-Scraping-State', 'abort');
                    }, 1500);
                } else {
                    broadcast('Scraping successfully completed!');

                    const response = reply(data)
                        .header('X-Scraping-State', 'done')
                        .header('X-Scraping-Redirect', `/news/${newsId}`)
                        .hold();

                    setTimeout(() => {
                        return response.send();
                    }, 1500);
                }
            });
        }
    });
});

server.ext('onPreResponse', function (request, reply) {
    const status = request.response.output;

    if (request.response.isBoom) {
        const ctx = {
            header: Object.assign({}, resources.header, {
                heading: 'Oops!',
                link: false
            }),
            message: `${status.statusCode}: ${status.payload.error}`
        };

        return reply.view('error', ctx);
    }

    return reply.continue();
});

server.start((err) => {
    if (err) {
        throw err;
    }

    log.info(`Server running at: ${server.info.uri}`);
});

function broadcast (message, type) {
    server.broadcast({
        message,
        type
    });

    return message;
}

function renderTimeDate (timestamp) {
    timestamp = +timestamp;

    const date = getDate(timestamp);
    const time = getTime(timestamp);

    return `${date} [${time}]`;
}
