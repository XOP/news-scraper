var log = require('log-util');
var selenium = require('selenium-standalone');

log.warn('Checking Selenium Server...');

// todo: refactor to process status
selenium.start({}, function (err, child) {
    if (err) {
        log.info('Selenium Server is running OK...')
    } else {
        child.kill();
        log.error('Looks like Selenium Server is not running. Exiting...');
        process.exit(1);
    }
});
