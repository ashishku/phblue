(function() {
  var app = angular.module('phblue');

  app.controller('AppCtrl', ['$scope', 'BlueTooth', AppCtrl]);

  function AppCtrl(scope, bluetooth) {
    bluetooth.enable();
  }
}());
