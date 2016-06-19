import is from 'is';
import log from './log-wrapper.js';

const html = function(title, body) {
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
            <style>
                body {
                    font: 16px/1.5 sans-serif;
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

export default html;
