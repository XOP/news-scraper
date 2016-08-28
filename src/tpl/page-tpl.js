import is from 'is';
import log from './../utils/log-wrapper.js';

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
            <meta charset="utf-8">
            <title>${title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" type="text/css" href="/main.css"/>
        </head>
        <body>
            <div><a href="/" title="Index page">Index</a></div>
            <h1>${title}</h1>
            ${body}
        </body>
    </html>`;
};

export default pageTemplate;
