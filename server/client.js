'use strict';
// configure our app
var Moonboots = require('moonboots');
var BBPromise = require('bluebird');
var glob = BBPromise.promisify(require('glob'));
var emptyDir = BBPromise.promisify(require('fs-extra').emptyDir);
var writeFile = BBPromise.promisify(require('fs-extra').writeFile);
var path = require('path');
var wiredep = require('wiredep')();
var marko = require('marko');
var config = require('config');
var _ = require('lodash');

var concat = require('./concat');

module.exports.configure = function (staticDist) {
    return BBPromise.try(function () {

        function buildDir() {
            if (staticDist) {
                return path.resolve(__rootDir, staticDist);
            }

            return null;
        }

        var moonboots_config = {
            path: __rootDir + '/client',
            indexPath: __rootDir + '/client/index.marko',
            main: __rootDir + '/client/app.concat.js',
            stylesheets: [__rootDir + '/client/css/main.css'].concat(wiredep.css),
            libraries: wiredep.js,
            modulesDir: __rootDir + '/shared',
            minify: false,
            buildDirectory: buildDir(),
            beforeBuildJS: function (done) {
                /**
                 * Grab all javascript files to include in the client
                 * exclude bower files (wiredep handles these)
                 * exclude app.concat.js (creating that now), this will be set as moonboots main
                 * exclude marko compiled templates
                 */
                glob(__rootDir + '/client/**/*.js', {
                    ignore: [
                        __rootDir + '/client/bower/**',
                        __rootDir + '/client/app.concat.js',
                        __rootDir + '/client/**/*.marko.js'
                    ]
                }).then(function (files) {
                    return concat(files, __rootDir + '/client/app.concat.js').then(function () {
                        done();
                    });
                }).catch(function (err) {
                    console.error('error building app.concat.js');
                    console.error(err);
                    throw 'error building app.concat.js';
                });
            },
            developmentMode: !staticDist
        };

        var prom = BBPromise.resolve();

        if (staticDist) {
            prom = emptyDir(buildDir());
        }

        return prom.then(function () {
            return new BBPromise(function (resolve) {
                var clientApp = new Moonboots(moonboots_config).on('ready', function () {
                    clientApp.path = moonboots_config.path;
                    clientApp.indexPath = moonboots_config.indexPath;
                    resolve(clientApp);
                });
            }).timeout(10000, 'Moonboots timed out');
        }).then(function (clientApp) {
            if (staticDist) {
                var template = marko.load(clientApp.indexPath).renderSync(_.merge(clientApp.htmlContext(), {
                    hostPrefix: 'http://' + config.get('HOSTNAME') + ':' + config.get('PORT') + '/'
                }));
                return writeFile(path.join(buildDir(), 'index.html'), template).then(function () {
                    console.log('created app for distribution at \'' + buildDir() + '\'');
                }).cancellable().cancel(new BBPromise.CancellationError('staticDist'));
            }

            return clientApp;
        });
    });
};
