'use strict';
var BBPromise = require('bluebird');
var marko = require('marko');
var http = require('http');

module.exports.configure = function (app, clientApp) {
    return BBPromise.try(function () {
        var index = marko.load(clientApp.indexPath);

        app.get('/' + clientApp.jsFileName(),
            function (req, res) {
                clientApp.jsSource(function (err, js) {
                    if (err) {
                        throw err;
                    }
                    res.set('Content-Type', 'application/javascript');
                    res.send(js);
                });
            }
        );

        app.get('/' + clientApp.cssFileName(),
            function (req, res) {
                clientApp.cssSource(function (err, css) {
                    if (err) {
                        throw err;
                    }
                    res.set('Content-Type', 'text/css');
                    res.send(css);
                });
            }
        );

        app.get('/cordova.js', function (req, res) {
            res.status(404).end();
        });

        app.get('*', function (req, res) {
            index.render(clientApp.htmlContext(), res);
        });

        return http.createServer(app);
    });
};
