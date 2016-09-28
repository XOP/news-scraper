#!/usr/bin/env node
"use strict";

var log = require('log-util');
var exec = require('child_process').exec;

module.exports = function () {
    var command = 'npm run transpile-server';

    exec(
        command,
        function (error, stdout, stderr) {
            if (error) {
                log.error('exec error: ' + error);
            }

            log.verbose(stdout);
            log.error(stderr);
        }
    );
};
