var path = require('path');
var log = require('../dist/utils/log-wrapper');
var Git = require('git-wrapper');

var cfg = require('../config.js');

log.info('Fetching remote ' + cfg.repo.path + '...');

var git = new Git({
    C: path.resolve(__dirname, '../', cfg.source.path)
});

git.exec('clone', [
    cfg.repo.path
], function (err) {
    if (err) {
        log.warn(err);
        log.info('Updating remote...');

        var git = new Git({
            C: path.resolve(__dirname, '../', cfg.source.path, cfg.repo.name)
        });

        git.exec('pull', [
            '--force'
        ], function (err) {
            if (err) {
                log.warn(err);
            } else {
                log.verbose('Fetching remote done!');
                log.debug('Source folder: ' + cfg.source.path + '/' + cfg.repo.name);
            }
        });
    } else {
        log.verbose('Fetching remote done!');
        log.debug('Source folder: ' + cfg.source.path + '/' + cfg.repo.name);
    }
});
