(function () {
    angular.module('app.components.chat', [])
        .controller('ChatIndexController', ChatIndexController);

    ChatIndexController.$inject = ['$scope', '$interval'];


    function ChatIndexController($scope, $interval) {
        const vm = this;

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
                console.log('DC')
                vm.chatHub.server.removeRoom(vm.subject);

                if (vm.rooms.indexOf(vm.subject) > -1) {
                    vm.rooms.splice(vm.subject, 1);
                }
                vm.isInChat = false;
            }
            

            vm.joinRoomFromList = function (room) {
                vm.subject = room;
                vm.createRoom();
            }

            vm.createRoom = function () {
                vm.chatHub.server.createRoom(vm.subject);
                vm.messages = [];
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