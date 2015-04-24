'use strict';
var express = require('express');
var BBPromise = require('bluebird');
var marko = require('marko');

module.exports.configure = function (app, clientApp) {
    return BBPromise.try(function () {

        var index = marko.load(clientApp.indexPath);

        app.use('/bower', express.static(clientApp.path + '/bower'));
        app.use('/css', express.static(clientApp.path + '/css'));

        console.log('hosting javascript at ' + clientApp.jsFileName());
        app.get('/' + clientApp.jsFileName(),
            function (req, res) {
                clientApp.jsSource(function (err, js) {
                    res.set('Content-Type', 'application/javascript');
                    res.send(js);
                });
            }
        );

        app.get('/', function (req, res) {
            index.render({
                appJsFilename: clientApp.jsFileName()
            }, res);
        });
    });
};
