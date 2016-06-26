require('dotenv').config();

var path = require('path');
var exec = require('child_process').execFile;

var log = require('dist/utils/log-wrapper.js');
var cfg = require('../config.js');

var outputPath = cfg.output.path;
var domain = process.env.SURGE_DOMAIN;

if (!domain) {
    log.error('Surge.sh domain name not specified. Check out .env file data.');
    process.exit(1);
}

exec('surge',
    [outputPath, domain],
    {
        cwd: path.resolve(__dirname, '../')
    },
    function (error) {
        if (error) {
            log.error(error);
        }
    }
);
