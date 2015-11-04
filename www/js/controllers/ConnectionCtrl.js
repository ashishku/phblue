(function() {
  var app = angular.module('phblue');

  app.controller('ConnectionCtrl', ['$scope', 'BlueTooth', ConnectionCtrl]);

  function ConnectionCtrl(scope, bluetooth) {
    var pairedDevices = [];
    var that = this;

    scope.pairedDevices = pairedDevices;
    scope.connection = bluetooth.connection;

    bluetooth.enable().then(function () {
      bluetooth.list().then(function (results) {
        scope.pairedDevices = results;
        console.log(JSON.stringify(results));
      }, function (error) {
        console.log(JSON.stringify(error));
      });
    }, function () {
      that.connected = false;
      console.log('Still Not Connected...');
    });

    scope.isConnectedTo = function(device) {
      return true;
    };

    scope.conntectTo = function(device) {
      bluetooth.connect(device);
    };

    scope.searchUnpaired = function() {
      bluetooth.discoverUnpaired().then(function (results) {
        scope.unpairedDevices = results;
        console.log(JSON.stringify(results));
      }, function (error) {
        console.log(JSON.stringify(error));
      });
    };
  }
}());
