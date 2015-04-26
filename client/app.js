(function () {
    'use strict';
    var app = angular.module('fluxchat', [
        'fluxchat.constants',
        'fluxchat.services'
    ]);

    app.run([
        'fluxchat.services.socket',
        'fluxchat.constants.socket_events',
        '$timeout',
        function (socket, SocketEvents, $timeout) {
            socket.on(SocketEvents.UserConnect, function (data) {
                console.log('user connect, ' + data.connectionCount + ' current users');
            });

            socket.on(SocketEvents.UserDisconnect, function (data) {
                console.log('user disconnected, ' + data.connectionCount + ' remaining');
            });

            socket.on(SocketEvents.Chat, function (msg) {
                console.log('message: ' + msg);
            });

            $timeout(function () {
                socket.emit(SocketEvents.Chat, {
                    message: 'sup'
                });
            }, 2000);
        }
    ]);
})();
