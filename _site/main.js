var myApp = angular.module('myApp', []);
 
myApp.factory('Data', function () {
  return { message: "I'm data from a service" }
});
 
function FirstCtrl($scope, Data) {
  $scope.data.entry = Data;

  $scope.reversedMessage = function(message) {
    return message.split("").reverse().join("");
  };
}
