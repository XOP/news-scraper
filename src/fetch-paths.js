import fs from 'fs';
import path from 'path';

import log from 'log-util';
import Promise from 'bluebird';

const readFile = Promise.promisify(fs.readFile);

const fetchPaths = function (src) {
    return readFile(src, 'utf8');
};

export default fetchPaths;
