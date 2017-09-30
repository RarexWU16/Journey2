(function () {

    angular.module('app.config', []).config(appConfig);

    function appConfig($routeProvider) {
        $routeProvider
        .when('/vehicles', {
            templateUrl: '../Scripts/app/components/vehicle/vehicle.index.view.html',
            controller: 'VehicleIndexController',
            controllerAs: 'VehicleIndexCtrl',

        })
        .when('/vehicles/register', {
            templateUrl: '../Scripts/app/components/vehicle/vehicle.register.view.html',
            controller: 'VehicleRegisterController',
            controllerAs: 'VehicleRegisterCtrl',

        })
        .when('/vehicles/details', {
            templateUrl: '../Scripts/app/components/vehicle/vehicle.details.view.html',
            controller: 'VehicleDetailsController',
            controllerAs: 'VehicleDetailsCtrl',

        })
        .when('/vehicles/details/:id', {
            templateUrl: '../Scripts/app/components/vehicle/vehicle.details.view.html',
            controller: 'VehicleDetailsController',
            controllerAs: 'VehicleDetailsCtrl',

        })
        .when('/vehicles/delete/:id', {
            templateUrl: '../Scripts/app/components/vehicle/vehicle.index.view.html',
            controller: 'VehicleDeleteController',
            controllerAs: 'VehicleDeleteCtrl',

        })
        .when('/trips', {
            templateUrl: '../Scripts/app/components/trip/trip.index.view.html',
            controller: 'TripIndexController',
            controllerAs: 'TripIndexCtrl',

        })
        .when('/', {
            templateUrl: '../Scripts/app/components/trip/trip.index.view.html',
            controller: 'TripIndexController',
            controllerAs: 'TripIndexCtrl',

        })
        .when('/trips/register', {
            templateUrl: '../Scripts/app/components/trip/trip.register.view.html',
            controller: 'TripRegisterController',
            controllerAs: 'TripRegisterCtrl',

        })
        .when('/trips/ongoing/:id', {
            templateUrl: '../Scripts/app/components/trip/trip.details.view.html',
            controller: 'TripDetailsController',
            controllerAs: 'TripDetailsCtrl',

        })
        .when('/trips/pdfreport', {
            templateUrl: '../Scripts/app/components/trip/trip.pdfreport.view.html',
            controller: 'TripPDFReportController',
            controllerAs: 'TripPDFReportCtrl',

        })
        .when('/trips/report', {
            templateUrl: '../Scripts/app/components/trip/trip.report.view.html',
            controller: 'TripReportController',
            controllerAs: 'TripReportCtrl',

        })
        .when('/chat', {
            templateUrl: '../Scripts/app/components/chat/chat.index.view.html',
            controller: 'ChatIndexController',
            controllerAs: 'ChatIndexCtrl',

        })
        .otherwise({
            redirectTo: '/'
        });
    }
})();