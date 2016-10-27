import path from 'path';
import fs from 'fs-extra';

import log from '../utils/log-wrapper';
import parseFile from '../utils/parse-file.js';

// import { getDate, getTime} from '../utils/date-utils.js';

const formatDirectives = (directivesPath) => {
    let directivesList = fs.readdirSync(directivesPath);

    if (!directivesList.length) {
        log.error('No directives in the directory!');

        return;
    }

    // so far we assume that all directives in YML format
    directivesList = directivesList.filter(name => name.indexOf('.yml') !== -1);

    // filter out service files
    directivesList = directivesList.filter(name => name.indexOf('_') === -1);

    if (!directivesList.length) {
        log.error('No directives with the required format in the directory!');

        return;
    }

    const formattedDirectives = directivesList.reduce(
        (groupDirectivesTotal, name) => {
            const groupPath = path.join(directivesPath, name);
            const groupDirectives = parseFile(groupPath);

            return groupDirectivesTotal.concat(groupDirectives);
        },
        []
    );

    return JSON.stringify(formattedDirectives);
};

export default formatDirectives;
