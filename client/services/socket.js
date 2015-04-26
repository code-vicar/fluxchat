(function () {
    /* global io */
    'use strict';
    var socket = io();

    var mod = angular.module('fluxchat.services.socket', []);

    mod.service('fluxchat.services.socket', function () {
        return socket;
    });
})();
