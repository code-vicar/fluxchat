(function () {
    'use strict';

    /**
     * socket event constants from shared modules folder
     */
    var socket_events = require('SocketEvents');

    var mod = angular.module('fluxchat.constants.socket_events', []);

    mod.constant('fluxchat.constants.socket_events', socket_events);
})();
