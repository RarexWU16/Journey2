﻿(function () {

    'use strict';

    angular
      .module('app.components.trip.services', [])
      .service('tripService', tripService);

    tripService.$inject = ['$http'];

    function tripService($http) {
        const baseURL = 'http://localhost:33355/api/trips/';


        this.getTrips = function () {
            return $http({
                method: 'GET',
                url: baseURL
            });
        };

        this.getLastTrip = function () {
            return $http({
                method: 'GET',
                url: baseURL + 'last'
            });
        }
        this.getOnGoing = function () {
            return $http({
                method: 'GET',
                url: baseURL + 'ongoing'
            });
        }
        this.editOnGoing = function (trip) {
            console.log(trip);
            return $http({
                method: 'GET',
                url: baseURL + 'ongoing/' + trip
            });
        }

        this.register = function (trip) {
            console.log(trip);
            return $http({
                method: 'POST',
                url: baseURL + 'register',
                data: trip
            });
        }

        this.getReport = function (vehicle) {
            console.log(vehicle.Vehicle.Id);
            return $http({
                method: 'GET',
                url: baseURL + 'report',
                data: vehicle.Vehicle.Id
            });
        };

        this.pdfReport = function (queryObj) {
            console.log(queryObj);
            return $http({
                method: 'POST',
                url: baseURL + 'pdfreport',
                data: queryObj
            });
        }
    }

})();