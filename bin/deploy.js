#!/usr/bin/env node
"use strict";

var cfg = require('../config.js');
var userCfg = require('../user.json');

var dataDir = cfg.output.path;
var domain = userCfg.surgeDomain;

console.log('surge', dataDir, domain);
