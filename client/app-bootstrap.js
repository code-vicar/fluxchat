/* global $ */
(function () {
    'use strict';
    var BBPromise = require('bluebird');
    window.fluxchat = window.fluxchat || {};

    window.fluxchat.injectSocketioScript = function () {
        return new BBPromise(function (resolve, reject) {
            var prefix = window.fluxchat.prefix; // e.g. 'http://localhost:3000/'

            if (window.device && window.device.platform === 'Android' && window.fluxchat.node_env === 'development') {
                prefix = prefix.replace(window.fluxchat.hostname, '10.0.2.2');
            }

            $.getScript(prefix + 'socket.io/socket.io.js').done(resolve).fail(reject);
        });
    };

    window.fluxchat.onDeviceReady = function () {
        return new BBPromise(function (resolve) {
            document.addEventListener('deviceready', resolve, false);
        }).timeout(3000);
    };

    window.fluxchat.bootstrap = function () {
        console.log('Bootstrapping angular');
        angular.bootstrap(document, ['fluxchat']);
    };
}());
