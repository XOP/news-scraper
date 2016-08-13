import fs from 'fs';
import fsExtra from 'fs-extra';

// TODO: consider refactoring to fs-e completely

import Promise from 'bluebird';

const readDir = Promise.promisify(fs.readdir);
const writeFile = Promise.promisify(fs.writeFile);
const readFile = Promise.promisify(fs.readFile);
const copySync = fsExtra.copySync;
const writeFileSync = fsExtra.outputFileSync;

export {
    readDir,
    writeFile,
    readFile,
    copySync,
    writeFileSync
};
