'use strict';
var socketio = require('socket.io');
var BBPromise = require('bluebird');

module.exports.configure = function (svr) {
    return BBPromise.try(function () {
        var io = socketio(svr);

        io.on('connection', function (socket) {
            socket.emit('news', {
                hello: 'world'
            });
            socket.on('my other event', function (data) {
                console.log(data);
            });
        });

        return io;
    });
};
