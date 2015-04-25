'use strict';
var socketio = require('socket.io');
var BBPromise = require('bluebird');

var SocketEvents = require(__rootDir + '/shared/SocketEvents');

module.exports.configure = function (svr) {
    return BBPromise.try(function () {
        var io = socketio(svr);

        var connectionCount = 0;

        io.on('connection', function (socket) {
            console.log('A user connected');
            connectionCount++;
            io.emit(SocketEvents.UserConnect, {
                connectionCount: connectionCount
            });

            socket.on('disconnect', function () {
                console.log('A user disconnected');
                connectionCount--;
                io.emit(SocketEvents.UserDisconnect, {
                    connectionCount: connectionCount
                });
            });
        });

        return io;
    });
};
