import Hapi from 'hapi';

import scraper from './scraper';

import log from './utils/log-wrapper';

import cfg from '../config';

const server = new Hapi.Server();

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

server.connection({
    port: 9000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('<html><body><a href="/scraper">Scraper 1</a></body></html>');
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

server.start((err) => {
    if (err) {
        throw err;
    }

    log.info(`Server running at: ${server.info.uri}`);
});
