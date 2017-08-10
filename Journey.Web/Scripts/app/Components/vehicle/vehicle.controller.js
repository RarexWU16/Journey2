(function () {
    angular.module('app.components.vehicle', [])
			.controller('VehicleIndexController', VehicleIndexController)
            .controller('VehicleRegisterController', VehicleRegisterController)
            .controller('VehicleDetailsController', VehicleDetailsController)
            .controller('VehicleDeleteController', VehicleDeleteController);

    VehicleIndexController.$inject = ['vehicleService'];
    VehicleRegisterController.$inject = ['vehicleService', '$window'];
    VehicleDetailsController.$inject = ['vehicleService', '$window', '$scope'];
    VehicleDeleteController.$inject = ['vehicleService', '$window', '$scope'];

    function VehicleIndexController(vehicleService) {
        const vm = this;

        vehicleService.getVehicles().then((response) => {
            console.log(response.data);
            vm.vehicles = response.data;
        }).catch((err) => {
            console.log(err);
        });
    }

    function VehicleRegisterController(vehicleService, $window) {
        const vm = this;
        var vehicle = {};

        vm.register = function () {
            vehicleService.register(vm.vehicle).then((response) => {
                if (response.data === 'success') {
                    console.log("Vehicle saved...");
                    //TODO Redirect and save message
                    $window.location.href = '#!/vehicles';
                };
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    function VehicleDetailsController(vehicleService, $window, $scope) {

        const vm = this;
        var url = $window.location.href;
        var vehicleId = url.substr(url.lastIndexOf('/') + 1);

        vm.showAll = false;

        vm.toggleShowAll = function () {
            vm.showAll = !vm.showAll;
        }

        //vehicleService.details(vm.details).then((response) => {
        //    console.log(response.data);
        //    vm.details = response.data;
        //    $window.location.href = '#!/trips/';
        //});
        console.log(vehicleId);

        vehicleService.editVehicle(vehicleId).then((response) => {
            vm.details = response.data;
            //$window.location.href = '#!/trips/details';
        });

        vm.edit = function () {

            var vehicle = vm.vehicle;
            var details = vm.details;


            vehicle.Id = details.Id;
            vehicle.RegistrationNumber = details.RegistrationNumber;

            vehicleService.register(vehicle).then((response) => {

                if (response.data === 'success') {
                    console.log("Vehicle updated...");
                    //TODO Redirect and save message
                    console.log('#!/vehicles/details/' + details.Id)
                    $window.location.href = '#!/vehicles';
                }
                else {
                    console.log("Not authorized");
                }
            }).catch((err) => {
                console.log(err);
            });
        };
    }
    function VehicleDeleteController(vehicleService, $window, $scope) {

        const vm = this;
        var url = $window.location.href;
        var vehicleId = url.substr(url.lastIndexOf('/') + 1);

        //vehicleService.details(vm.details).then((response) => {
        //    console.log(response.data);
        //    vm.details = response.data;
        //    $window.location.href = '#!/trips/';
        //});
        console.log(vehicleId);

        vehicleService.removeVehicle(vehicleId).then((response) => {
            if (response.data === 'success') {
                console.log("Vehicle updated...");
                //TODO Redirect and save message
                $window.location.href = '#!/vehicles';
            }
            else {
                console.log("Not authorized");
            }
        });
    }
})();