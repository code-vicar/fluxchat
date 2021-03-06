(function () {
    'use strict';

    var mod = angular.module('fluxchat.services.socket', []);

    mod.service('fluxchat.services.socket', ['$window', function ($window) {

        var prefix = $window.fluxchat.prefix;

        if ($window.device && $window.device === 'Android' && $window.fluxchat.node_env === 'development') {
            prefix = prefix.replace($window.fluxchat.hostname, '10.0.2.2');
        }

        return $window.io(prefix);
    }]);
})();
