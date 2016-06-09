var path = require('path');
var log = require('log-util');
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
                log.debug('Fetching remote done!');
                log.debug('Source folder: ' + cfg.source.path + '/' + cfg.repo.name);
            }
        });
    } else {
        log.debug('Fetching remote done!');
        log.debug('Source folder: ' + cfg.source.path + '/' + cfg.repo.name);
    }
});
