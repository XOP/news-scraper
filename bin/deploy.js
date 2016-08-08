#!/usr/bin/env node
"use strict";

var cfg = require('../config.js');

var dataDir = cfg.output.path;
var domain = cfg.surgeDomain;

console.log('surge', dataDir, domain);
