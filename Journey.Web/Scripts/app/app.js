(function() {
    'use strict';

    angular.module('app', ['luegg.directives', 'ui.bootstrap', 'ngRoute', 'app.config',
        'app.components.vehicle',
        'app.components.trip',
        'app.components.chat',
        'app.components.vehicle.services',
        'app.components.trip.services']);
})();