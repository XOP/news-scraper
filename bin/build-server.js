#!/usr/bin/env node
"use strict";

var log = require('../dist/utils/log-wrapper.js');
var exec = require('child_process').exec;

var command = 'npm run build-server';

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
