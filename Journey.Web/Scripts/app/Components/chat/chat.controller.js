(function () {
    angular.module('app.components.chat', [])
        .controller('ChatIndexController', ChatIndexController);

    ChatIndexController.$inject =['$scope'];


    function ChatIndexController($scope) {
        const vm = this;

        vm.name = 'Användare'; // holds the user's name
        vm.message = ''; // holds the new message
        vm.messages =[]; // collection of messages coming from server
        vm.chatHub = null; // holds the reference to hub

        vm.chatHub = $.connection.chatHub;

        // register a client method on hub to be invoked by the server
        vm.chatHub.client.broadcastMessage = function (name, message) {
            var newMessage = name + ' säger: ' + message;

            // push the newly coming message to the collection of messages
            vm.messages.push(newMessage);
            $scope.$apply();

        };
        $.connection.hub.start().done(function (){
            vm.newMessage = function () {
                // sends a new message to the server
                vm.chatHub.server.sendMessage(vm.name, vm.message);

                vm.message = '';
            };
        });
    }
})();