(function() {
  var app = angular.module('phblue');

  app.controller('ConnectionCtrl', ['$scope', 'BlueTooth', '$ionicLoading', ConnectionCtrl]);

  function ConnectionCtrl(scope, bluetooth, $ionicLoading) {
    var that = this;

    scope.pairedDevices = [];
    scope.unpairedDevices = [];
    scope.connection = bluetooth.connection;

    $ionicLoading.show({
      template: 'Searching...'
    });

    bluetooth.enable().then(function () {
      bluetooth.list().then(function (results) {
        scope.pairedDevices = results;
        console.log(JSON.stringify(results));
        $ionicLoading.hide();
      }, function (error) {
        console.log(JSON.stringify(error));
        $ionicLoading.hide();
      });
    }, function () {
      that.connected = false;
      console.log('Still Not Connected...');
      $ionicLoading.hide();
    });

    scope.isConnectedTo = function(device) {
      return bluetooth.isConnectedTo();
    };

    scope.conntectTo = function(device) {
      bluetooth.connect(device);
    };

    scope.searchUnpaired = function() {
      $ionicLoading.show({
        template: 'Searching...'
      });
      bluetooth.discoverUnpaired().then(function (results) {
        scope.unpairedDevices = results;
        console.log(JSON.stringify(results));
        $ionicLoading.hide();
      }, function (error) {
        console.log(JSON.stringify(error));
        $ionicLoading.hide();
      });
    };
  }
}());
