import is from 'is';
import log from './log-wrapper.js';

const pageTemplate = (title, body) => {
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
            <link rel="stylesheet" type="text/css" href="/main.css"/>
        </head>
        <body>
            <h1>${title}</h1>
            ${body}
        </body>
    </html>`;
};

export default pageTemplate;
