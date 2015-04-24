'use strict';
var express = require('express');
var BBPromise = require('bluebird');

var indexPath = require.resolve('./client/index.marko');
var index = require('marko').load(indexPath);

module.exports.configure = function (app, clientApp) {
    return BBPromise.try(function () {
        app.use('/bower', express.static('client/bower'));
        app.use('/css', express.static('client/css'));

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
