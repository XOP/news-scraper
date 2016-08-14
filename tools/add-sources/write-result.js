var fs = require('fs');

var log = require('log-util');

var parseFile = require('../../dist/utils/parse-file.js');
var readFile = require('../../dist/utils/file-ops.js').readFile;
var writeFile = require('../../dist/utils/file-ops.js').writeFile;

var writeResult = function (result, filePath) {
    var exists = false;

    try {
        fs.accessSync(filePath.path, fs.F_OK);
        exists = !exists;
    } catch (err) {
        log.verbose(err);
    }

    if (exists) {

        // file exists, read and update one
        log.warn('File ' + filePath.name + '.json' + ' already exists. Updating file with new data...');

        readFile(filePath.path, 'utf8')
            .then(function (fileContent) {
                var updatedResult = Object.assign({}, fileContent ? parseFile(fileContent) : {}, result);

                writeResult(updatedResult);
            })
            .catch(function (err) {
                log.error('There was a problem reading file ' + filePath.name);
                log.error(err);
            });
    } else {

        // file does not exist, create and write one
        log.warn('File ' + filePath.name + '.json' + ' does not exist. Creating file...');

        writeResult(result);
    }

    function writeResult (result) {
        return writeFile(filePath.path, JSON.stringify(result), 'utf8')
            .then(function () {
                log.verbose('New sources were added to:');
                log.info(filePath.path);
                log.verbose('Sources fill dialog now terminates');
            })
            .catch(function (err) {
                log.error('There was a problem writing file ' + filePath.name);
                log.error(err);
            });
    }
};

module.exports = writeResult;
