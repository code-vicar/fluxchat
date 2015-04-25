'use strict';
var socket = require('./socket');
var SocketEvents = require('SocketEvents');

socket.on(SocketEvents.UserConnect, function (data) {
    console.log('user connect, ' + data.connectionCount + ' current users');
});

socket.on(SocketEvents.UserDisconnect, function (data) {
    console.log('user disconnected, ' + data.connectionCount + ' remaining');
});
