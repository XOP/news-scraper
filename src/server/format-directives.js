import path from 'path';
import fs from 'fs-extra';

import _get from 'lodash.get';

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

            let pureGroupDirectives = groupDirectives;

            const groupInfo = _get(groupDirectives, 'meta') || {};

            if (groupInfo) {
                delete pureGroupDirectives.meta;
            }

            const formattedGroupDirectives = {
                name: groupInfo.name || name,
                description: groupInfo.description,
                directives: JSON.stringify(pureGroupDirectives)
            };

            return groupDirectivesTotal.concat(formattedGroupDirectives);
        },
        []
    );

    return formattedDirectives;
};

export default formatDirectives;
