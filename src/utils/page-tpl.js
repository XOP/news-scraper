import is from 'is';
import log from './log-wrapper.js';

const pageTemplate = function(title, body) {
    if (!body) {
        log.error('No render body data. Check html params.');
        process.exit(1);
    }

    if (!is.string(title) || !is.string(body)) {
        log.error('title and body should be strings. Check html params.');
        process.exit(1);
    }

    return `<!doctype html>
    <html>
        <head>
            <title>${title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    margin: 0;
                    font: 16px/1.5 sans-serif;
                }

                section {
                    max-width: 40rem;
                    margin: 0 auto;
                    margin-bottom: 2rem;
                }

                a {
                    display: block;
                    padding: .5rem;
                    color: #333;
                }
                a:hover {
                    color: #fff;
                    background: #666;
                }
            </style>
        </head>
        <body>${body}</body>
    </html>`;
};

export default pageTemplate;
