var myApp = angular.module('myApp', []); 
 
myApp.factory('Avengers', function () {
  var Avengers = {};
  Avengers.cast = [
    {
      name: "actor1",
      character: "char1"
    },{
      name: "actor2",
      character: "char2"
    },{
      name: "actor3",
      character: "char3"
    },{
      name: "what what",
      character: "Hulk Guy"
    }
  ];
  return Avengers;
});

function AvengersCtrl($scope, Avengers) {
  $scope.avengers = Avengers;
}
