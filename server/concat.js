'use strict';
var BBPromise = require('bluebird');

var fs = BBPromise.promisifyAll(require('fs'));

var append = function (file, dest) {
    return fs.readFileAsync(file, 'utf8').then(function (contents) {
        return fs.appendFileAsync(dest, contents);
    });
};

var concat = function concat(files, dest) {
    return fs.writeFileAsync(dest, '').then(function () {

        var prom = BBPromise.resolve();
        files.forEach(function (file) {
            prom = prom.then(function () {
                return append(file, dest);
            });
        });

        return prom;
    });
};

module.exports = concat;
