(function () {
    /* global io */
    'use strict';

    var mod = angular.module('fluxchat.services.socket', []);

    mod.service('fluxchat.services.socket', ['$window', function ($window) {
        var socket = io($window.fluxchat.hostPrefix);
        return socket;
    }]);
})();
