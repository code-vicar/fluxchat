'use strict';
// configure our app
var Moonboots = require('moonboots');
var BBPromise = require('bluebird');

module.exports.configure = function (config) {
    config = config || {};
    config.timeout = config.timeout || 10000;

    return new BBPromise(function (resolve) {
        var clientApp = new Moonboots(config).on('ready', function () {
            clientApp.path = config.path;
            clientApp.indexPath = config.indexPath;
            resolve(clientApp);
        });
    }).timeout(config.timeout, 'Moonboots timed out');
};
