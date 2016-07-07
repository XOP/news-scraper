import fs from 'fs';

import Promise from 'bluebird';

const readDir = Promise.promisify(fs.readdir);
const writeFile = Promise.promisify(fs.writeFile);
const readFile = Promise.promisify(fs.readFile);

export {
    readDir,
    writeFile,
    readFile
}
