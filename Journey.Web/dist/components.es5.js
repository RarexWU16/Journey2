'use strict';

(function () {
    angular.module('app.components.chat', []).controller('ChatIndexController', ChatIndexController);

    ChatIndexController.$inject = ['$scope', '$interval'];

    function ChatIndexController($scope, $interval) {
        var vm = this;

        vm.name = 'Användare'; // holds the user's name
        vm.subject = '';
        vm.message = ''; // holds the new message
        vm.messages = []; // collection of messages coming from server
        vm.chatHub = null; // holds the reference to hub
        vm.rooms = [];

        vm.chatHub = $.connection.chatHub;

        vm.isInChat = false;

        // register a client method on hub to be invoked by the server
        vm.chatHub.client.broadcastMessage = function (name, message) {
            var newMessage = name + ' säger: ' + message;

            // push the newly coming message to the collection of messages
            vm.messages.push(newMessage);
            $scope.$apply();
        };
        vm.chatHub.client.broadcastRooms = function (rooms) {
            for (var i = 0; i < rooms.length; i++) {
                if (vm.rooms.indexOf(rooms[i]) === -1) {
                    vm.rooms.push(rooms[i]);
                }
            }
            $scope.$apply();
        };

        $.connection.hub.start().done(function () {
            vm.chatHub.server.getAllRooms();

            $interval(function () {
                vm.chatHub.server.getAllRooms();
            }, 5000);

            vm.disconnect = function () {
                vm.chatHub.server.removeRoom(vm.subject);

                vm.rooms = [];
                vm.chatHub.server.getAllRooms();
                vm.isInChat = false;
            };

            vm.joinRoomFromList = function (room) {
                vm.subject = room;
                vm.createRoom();
            };

            vm.createRoom = function () {
                vm.chatHub.server.createRoom(vm.subject, vm.name);
                vm.messages = [];
                vm.messages.push("Vänta på att en administratör ska ansluta innan du skriver...");
                vm.isInChat = true;
            };

            vm.newMessage = function () {
                // sends a new message to the server
                vm.chatHub.server.sendMessage(vm.name, vm.message, vm.subject);

                vm.message = '';
            };
        });
    }
})();
(function () {
    angular.module('app.components.trip', []).controller('TripIndexController', TripIndexController).controller('TripRegisterController', TripRegisterController).controller('TripPDFReportController', TripPDFReportController).controller('TripReportController', TripReportController).controller('TripDetailsController', TripDetailsController);

    TripIndexController.$inject = ['tripService', '$window'];
    TripDetailsController.$inject = ['tripService', '$window', '$scope'];
    TripRegisterController.$inject = ['tripService', 'vehicleService', '$window', '$scope'];
    TripPDFReportController.$inject = ['tripService', 'vehicleService', '$window'];
    TripReportController.$inject = ['tripService', 'vehicleService', '$window', '$scope'];

    function TripIndexController(tripService) {
        var vm = this;

        vm.showAll = false;

        vm.toggleShowAll = function () {
            vm.showAll = !vm.showAll;
        };

        tripService.getTrips().then(function (response) {
            console.log(response.data);
            vm.trips = response.data;
        });

        tripService.getLastTrip().then(function (response) {
            console.log(response.data);
            vm.lastTrip = response.data;
        });

        tripService.getOnGoing().then(function (response) {
            console.log(response.data);

            if (response.data === 'No Trip') {
                vm.onGoingTrip = null;
                vm.isTrip = false;
            } else {
                vm.onGoingTrip = response.data;
                vm.isTrip = true;
            }
        });
    }

    function TripDetailsController(tripService, $window, $scope) {

        var vm = this;
        var url = $window.location.href;
        var tripId = url.substr(url.lastIndexOf('/') + 1);

        vm.showAll = false;

        vm.toggleShowAll = function () {
            vm.showAll = !vm.showAll;
        };

        tripService.editOnGoing(tripId).then(function (response) {
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
            trip.Notes = details.Notes;

            tripService.register(trip).then(function (response) {

                if (response.data === 'success') {
                    console.log("Trip updated...");
                    $window.location.href = '#!/trips';
                } else {
                    console.log("Not authorized");
                }
            })['catch'](function (err) {
                console.log(err);
            });
        };
    }

    function TripRegisterController(tripService, vehicleService, $window, $scope) {
        var vm = this;
        var trip = {};
        var vehicles = {};
        var favorite = {};

        vm.vehicles = function () {
            vehicleService.getVehicles().then(function (response) {
                console.log(response);
                console.log(response.data);

                //Some sorting and filtering
                response.data.sort(function (x, y) {
                    return y.IsDefault - x.IsDefault;
                });
                var filtered = response.data.filter(function (el) {
                    return el.IsActive == true;
                });

                vm.vehicles = filtered;
                vm.favorite = filtered[0];
            });
        };

        vm.update = function () {
            vm.favorite.Id = vm.trip.Vehicle.Id;
        };

        vm.getLocation = function () {

            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition, Error);
                } else {
                    console.log("No support for geolocation!");
                }
            }
            function error(error) {
                console.log(error);
            }

            function showPosition(position) {
                console.log(position);

                var geocoder = new google.maps.Geocoder();

                var coords = position.coords;

                var userPosition = { lat: parseFloat(coords.latitude), lng: parseFloat(coords.longitude) };

                geocoder.geocode({ 'location': userPosition }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            var formattedAddress = results[0].formatted_address;

                            vm.trip.StartAddress = formattedAddress;
                            $scope.$apply();
                            console.log(formattedAddress);
                        } else {
                            console.log("No match!");
                        }
                    } else {
                        console.log("Error");
                    }
                });
            }

            getLocation();
        };

        vm.register = function () {
            tripService.register(vm.trip).then(function (response) {

                if (response.data === 'error') {
                    alert("Startmätarställning måste vara lägre än föregående resa.");
                }

                if (response.data === 'success') {
                    console.log("Trip saved...");
                    $window.location.href = '#!/trips/';
                } else {
                    console.log("Not authorized");
                }
            })['catch'](function (err) {
                console.log(err);
            });
        };
    }

    function TripPDFReportController(tripService, vehicleService) {
        var vm = this;
        var queryObj = {};
        var vehicles = {};
        var report = null;

        vm.vehicles = function () {
            vehicleService.getVehicles().then(function (response) {

                vm.vehicles = response.data;
            });
        };

        vm.pdfReport = function () {
            tripService.pdfReport(vm.queryObj).then(function (response) {

                vm.report = response.data;
            })['catch'](function (err) {
                console.log(err);
            });
        };
    }

    function TripReportController(tripService, vehicleService, $window, $scope) {
        var vm = this;
        var queryObj = {};
        var vehicles = {};
        var report = null;

        vm.vehicles = function () {
            vehicleService.getVehicles().then(function (response) {

                console.log(response.data);
                vm.vehicles = response.data;
            });
        };

        vm.chart = function () {

            tripService.report(vm.queryObj).then(function (response) {

                vm.report = response.data;

                $scope.labels = ["0-20 km", "21-50 km", "51-200 km"];
                $scope.data = [vm.report.ZeroToTwenty, vm.report.TwentyOneToFifty, vm.report.FiftyOneToTwoHundred];
            })['catch'](function (err) {
                console.log(err);
            });
        };
    }
})();
(function () {

    'use strict';

    angular.module('app.components.trip.services', []).service('tripService', tripService);

    tripService.$inject = ['$http'];

    function tripService($http) {
        var baseURL = 'http://localhost:33355/api/trips/';

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
        };
        this.getOnGoing = function () {
            return $http({
                method: 'GET',
                url: baseURL + 'ongoing'
            });
        };
        this.editOnGoing = function (trip) {
            console.log(trip);
            return $http({
                method: 'GET',
                url: baseURL + 'ongoing/' + trip
            });
        };

        this.register = function (trip) {
            console.log(trip);
            return $http({
                method: 'POST',
                url: baseURL + 'register',
                data: trip
            });
        };

        this.report = function (queryObj) {
            console.log(queryObj);
            return $http({
                method: 'POST',
                url: baseURL + 'report',
                data: queryObj
            });
        };

        this.pdfReport = function (queryObj) {
            console.log(queryObj);
            return $http({
                method: 'POST',
                url: baseURL + 'pdfreport',
                data: queryObj
            });
        };
    }
})();
(function () {
    angular.module('app.components.vehicle', []).controller('VehicleIndexController', VehicleIndexController).controller('VehicleRegisterController', VehicleRegisterController).controller('VehicleDetailsController', VehicleDetailsController).controller('VehicleDeleteController', VehicleDeleteController);

    VehicleIndexController.$inject = ['vehicleService'];
    VehicleRegisterController.$inject = ['vehicleService', '$window'];
    VehicleDetailsController.$inject = ['vehicleService', '$window', '$scope'];
    VehicleDeleteController.$inject = ['vehicleService', '$window', '$scope'];

    function VehicleIndexController(vehicleService) {
        var vm = this;

        vehicleService.getVehicles().then(function (response) {
            console.log(response.data);
            vm.vehicles = response.data;
        })['catch'](function (err) {
            console.log(err);
        });
    }

    function VehicleRegisterController(vehicleService, $window) {
        var vm = this;
        var vehicle = {};

        vm.register = function () {
            vehicleService.register(vm.vehicle).then(function (response) {
                if (response.data === 'success') {
                    console.log("Vehicle saved...");
                    //TODO Redirect and save message
                    $window.location.href = '#!/vehicles';
                };
            })['catch'](function (err) {
                console.log(err);
            });
        };
    }

    function VehicleDetailsController(vehicleService, $window, $scope) {

        var vm = this;
        var url = $window.location.href;
        var vehicleId = url.substr(url.lastIndexOf('/') + 1);

        vm.showAll = false;

        vm.toggleShowAll = function () {
            vm.showAll = !vm.showAll;
        };

        //vehicleService.details(vm.details).then((response) => {
        //    console.log(response.data);
        //    vm.details = response.data;
        //    $window.location.href = '#!/trips/';
        //});
        console.log(vehicleId);

        vehicleService.editVehicle(vehicleId).then(function (response) {
            vm.details = response.data;
            //$window.location.href = '#!/trips/details';
        });

        vm.edit = function () {

            var vehicle = vm.vehicle;
            var details = vm.details;

            vehicle.Id = details.Id;
            vehicle.RegistrationNumber = details.RegistrationNumber;

            vehicleService.register(vehicle).then(function (response) {

                if (response.data === 'success') {
                    console.log("Vehicle updated...");
                    //TODO Redirect and save message
                    console.log('#!/vehicles/details/' + details.Id);
                    $window.location.href = '#!/vehicles';
                } else {
                    console.log("Not authorized");
                }
            })['catch'](function (err) {
                console.log(err);
            });
        };
    }
    function VehicleDeleteController(vehicleService, $window, $scope) {

        var vm = this;
        var url = $window.location.href;
        var vehicleId = url.substr(url.lastIndexOf('/') + 1);

        //vehicleService.details(vm.details).then((response) => {
        //    console.log(response.data);
        //    vm.details = response.data;
        //    $window.location.href = '#!/trips/';
        //});
        console.log(vehicleId);

        vehicleService.removeVehicle(vehicleId).then(function (response) {
            if (response.data === 'success') {
                console.log("Vehicle updated...");
                //TODO Redirect and save message
                $window.location.href = '#!/vehicles';
            } else {
                console.log("Not authorized");
            }
        });
    }
})();
(function () {

    'use strict';

    angular.module('app.components.vehicle.services', []).service('vehicleService', vehicleService);

    vehicleService.$inject = ['$http'];

    function vehicleService($http) {
        var baseURL = 'http://localhost:33355/api/vehicles/';

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
        };

        this.removeVehicle = function (vehicle) {
            return $http({
                method: 'GET',
                url: baseURL + 'delete/' + vehicle
            });
        };

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

