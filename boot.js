'use strict';
/**
 * set global rootDir property
 */
global.__rootDir = __dirname;

// imports
var express = require('express');
var BBPromise = require('bluebird');
var config = require('config');

var client = require('./server/client');
var server = require('./server/server');
var sockets = require('./server/sockets');

// set default NODE_ENV to development
if (!config.util.getEnv('NODE_ENV')) {
    process.env.NODE_ENV = 'development';
}

module.exports = function (staticDist) {

    /**
     * Create Express app
     */
    var app = express();
    var _clientApp;
    var _server;
    var _io;


    /**
     * Configure the moonboots client
     * @param config Moonboots configuration object
     * @return clientApp promise that resolves to the moonboots client app
     */
    return client.configure(staticDist).then(function (clientApp) {
        /**
         * Configure the express app
         * @param app The express app to configure
         * @param clientApp The configured moonboots client app
         * @return svr promise resolves a node http server
         */
        _clientApp = clientApp;
        return server.configure(app, clientApp);
    }).then(function (svr) {
        /**
         * Configure socket.io
         * @param svr node http server
         * @return io promise resolves a socketio instance
         */
        _server = svr;
        return sockets.configure(svr);
    }).then(function (io) {
        /**
         * start server
         */
        _io = io;
        console.log('listening at http://' + config.get('HOSTNAME') + ':' + config.get('PORT'));
        _server.listen(parseInt(config.get('PORT'), 10));
    }).catch(BBPromise.CancellationError, function (err) {
        if (err.message !== 'staticDist') {
            throw err;
        }
    }).catch(function (err) {
        console.log('server crashed :(');
        console.log(err);
    });

};
