(function () {

    'use strict';

    angular
      .module('app.components.vehicle.services', [])
      .service('vehicleService', vehicleService);

    vehicleService.$inject = ['$http'];

    function vehicleService($http) {
        const baseURL = 'http://localhost:33355/api/vehicles/';
        

        this.getVehicles = function () {
            return $http({
                method: 'GET',
                url: baseURL
            });
        };

        this.details = function (vehicle) {
            return $http({
                method: 'GET',
                url: baseURL + 'details/' + vehicle 
            });
        };

        this.editVehicle = function (vehicle) {
            return $http({
                method: 'GET',
                url: baseURL + 'details/' + vehicle
            });
        }

        this.removeVehicle = function (vehicle) {
            return $http({
                method: 'GET',
                url: baseURL + 'delete/' + vehicle
            });
        }

        this.register = function (vehicle) {
            console.log(vehicle);
            return $http({
                method: 'POST',
                url: baseURL + 'register',
                data: vehicle
            });
        };
    }

})();