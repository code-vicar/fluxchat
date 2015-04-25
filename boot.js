'use strict';
/**
 * set global rootDir property
 */
global.__rootDir = __dirname;

// imports
var express = require('express');
var client = require('./server/client');
var server = require('./server/server');
var sockets = require('./server/sockets');

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
client.configure({
    path: __dirname + '/client',
    indexPath: __dirname + '/client/index.marko',
    main: __dirname + '/client/js/app.js',
    modulesDir: __dirname + '/shared',
    developmentMode: true
}).then(function (clientApp) {
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
    console.log('listening on port 3000');
    _server.listen(3000);
});
