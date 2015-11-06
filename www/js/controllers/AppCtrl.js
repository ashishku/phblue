(function() {
  var app = angular.module('phblue');

  app.controller('AppCtrl', ['$scope', 'BlueTooth', AppCtrl]);

  function AppCtrl(scope, bluetooth) {
    scope.connection = bluetooth.connection;
  }
}());
