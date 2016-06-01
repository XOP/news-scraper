var path = require('path');

var config = {
    source: {
        paths: path.join(__dirname, 'assets/paths.yml'),
        limit: 3
    }
};

module.exports = config;
