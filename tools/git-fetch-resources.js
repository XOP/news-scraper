var path = require('path');
var log = require('log-util');
var Git = require('git-wrapper');

var cfg = require('../config.js');

log.info('Fetching remote ' + cfg.git + '...');

var git = new Git({
    'C': path.resolve(__dirname, '../', cfg.assets)
});

git.exec('clone', [
    cfg.git
], function (err) {
    if (err) {
        log.warn(err);
        log.info('Updating remote...');

        var git = new Git({
            'C': path.resolve(__dirname, '../', cfg.assets, cfg.repo)
        });

        git.exec('pull', [
            '--force'
        ], function (err) {
            if (err) {
                log.warn(err);
            } else {
                log.debug('Fetching remote done!');
                log.debug('Source folder: ' + cfg.assets + '/' + cfg.repo);
            }
        })
    } else {
        log.debug('Fetching remote done!');
        log.debug('Source folder: ' + cfg.assets + '/' + cfg.repo);
    }
});
