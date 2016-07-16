var log = require('../dist/utils/log-wrapper');
var selenium = require('selenium-standalone');
var Promise = require('bluebird');

log.warn('Checking Selenium Server...');

// todo: refactor to process status

module.exports = function () {
    return new Promise(function (resolve, reject) {
        return selenium.start({}, function (err, child) {
            if (err) {
                log.info('Selenium Server is running OK...');
                resolve();
            } else {
                child.kill();
                log.error('Looks like Selenium Server is not running. Exiting...');
                reject(process.exit(1));
            }
        });
    });
};
