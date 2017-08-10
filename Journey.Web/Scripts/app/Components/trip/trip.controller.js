﻿(function () {
    angular.module('app.components.trip', [])
			.controller('TripIndexController', TripIndexController)
            .controller('TripRegisterController', TripRegisterController)
            .controller('TripReportController', TripReportController)
            .controller('TripDetailsController', TripDetailsController);

    TripIndexController.$inject = ['tripService', '$window'];
    TripDetailsController.$inject = ['tripService', '$window', '$scope'];
    TripRegisterController.$inject = ['tripService', 'vehicleService', '$window'];
    TripReportController.$inject = ['tripService', 'vehicleService', '$window'];

    function TripIndexController(tripService) {
        const vm = this;

        vm.showAll = false;

        vm.toggleShowAll = function () {
            vm.showAll = !vm.showAll;
        }


        tripService.getTrips().then((response) => {
            console.log(response.data);
            vm.trips = response.data;
        });

        tripService.getLastTrip().then((response) => {
            console.log(response.data);
            vm.lastTrip = response.data;
        });

        tripService.getOnGoing().then((response) => {
            console.log(response.data);

            if (response.data === 'No Trip') {
                vm.onGoingTrip = null;
                vm.isTrip = false;
            }
            else {
                vm.onGoingTrip = response.data;
                vm.isTrip = true;
            }
            
        });
    }

    function TripDetailsController(tripService, $window, $scope) {

        const vm = this;
        var url = $window.location.href;
        var tripId = url.substr(url.lastIndexOf('/') + 1);

        vm.showAll = false;

        vm.toggleShowAll = function () {
            vm.showAll = !vm.showAll;
        }

        tripService.editOnGoing(tripId).then((response) => {
            vm.details = response.data;
            //$window.location.href = '#!/trips/details';
        });

        // EDIT
        vm.edit = function () {

            var trip = vm.trip;
            var details = vm.details;

            trip.Id = details.Id;
            trip.Vehicle = details.Vehicle;
            trip.DateTime = details.DateTime;
            trip.StartMilage = details.StartMilage;
            trip.StartAddress = details.StartAddress;
            trip.ArrivalAddress = details.ArrivalAddress;
            trip.Errand = details.Errand;        

            tripService.register(trip).then((response) => {

                if (response.data === 'success') {
                    console.log("Trip updated...");
                    //TODO Redirect and save message
                    console.log('#!/trips/ongoing/' + details.Id)
                    $window.location.href = '#!/trips';
                }
                else {
                    console.log("Not authorized");
                }
            }).catch((err) => {
                console.log(err);
            });
        };
    }

    function TripRegisterController(tripService, vehicleService, $window) {
        const vm = this;
        var trip = {};
        var vehicles = {};
        var favorite = {};

        vm.vehicles = function () {
            vehicleService.getVehicles().then((response) => {
                console.log(response);
                console.log(response.data);


                //Some sorting and filtering
                response.data.sort(function (x, y) { return y.IsDefault - x.IsDefault });
                var filtered = response.data.filter(function (el) { return el.IsActive == true; });

                vm.vehicles = filtered;
                vm.favorite = filtered[0];
            });
        };


        vm.register = function () {
            tripService.register(vm.trip).then((response) => {
                
                if (response.data === 'success') {
                    console.log("Trip saved...");
                    //TODO Redirect and save message
                    $window.location.href = '#!/trips/';
                }
                else {
                    console.log("Not authorized");
                }
            }).catch((err) => {
                console.log(err);
            });
        };
    }

    function TripReportController(tripService, vehicleService, $window) {
        const vm = this;
        var queryObj = {};
        var vehicles = {};
        var report = {}

        vm.vehicles = function () {
            vehicleService.getVehicles().then((response) => {

                console.log(response.data);
                vm.vehicles = response.data;
            });
        };


        vm.pdfReport = function () {
            console.log("Creating PDF");
            console.log(vm.queryObj);
            tripService.pdfReport(vm.queryObj).then((response) => {
                console.log("Pdf created...");
                vm.report = response.data;
                //TODO Redirect and save message
                $window.location.href = '#!/trips/';

            }).catch((err) => {
                console.log(err);
            });
        };

    }

})();