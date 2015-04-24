'use strict';
var express = require('express');

var client = require('./client');
var server = require('./server');

var app = express();

client.configure(app, {
    main: __dirname + '/client/js/app.js',
    developmentMode: true
}).then(function (clientApp) {
    return server.configure(app, clientApp);
}).then(function () {
    console.log('listening on port 3000');
    app.listen(3000);
});
