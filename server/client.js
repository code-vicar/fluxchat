'use strict';
// configure our app
var Moonboots = require('moonboots');
var BBPromise = require('bluebird');
var glob = BBPromise.promisify(require('glob'));

var concat = require('./concat');

module.exports.configure = function () {
    return BBPromise.try(function () {

        /**
         * Grab all javascript files to include in the client
         * exclude bower files (wiredep handles these)
         * exclude built app.js file (this will be set as moonboots main)
         * exclude marko compiled templates
         */
        return glob(__rootDir + '/client/**/*.js', {
            ignore: [
                __rootDir + '/client/bower/**',
                __rootDir + '/client/app.concat.js',
                __rootDir + '/client/**/*.marko.js'
            ]
        }).then(function (files) {
            var config = {
                path: __rootDir + '/client',
                indexPath: __rootDir + '/client/index.marko',
                main: __rootDir + '/client/app.concat.js',
                modulesDir: __rootDir + '/shared',
                beforeBuildJS: function (done) {
                    concat(files, __rootDir + '/client/app.concat.js').then(function () {
                        done();
                    }).catch(function (err) {
                        console.error('error building app.concat.js');
                        console.error(err);
                        throw 'error building app.concat.js';
                    });
                },
                developmentMode: true
            };

            return new BBPromise(function (resolve) {
                var clientApp = new Moonboots(config).on('ready', function () {
                    clientApp.path = config.path;
                    clientApp.indexPath = config.indexPath;
                    resolve(clientApp);
                });
            }).timeout(10000, 'Moonboots timed out');
        });
    });
};
