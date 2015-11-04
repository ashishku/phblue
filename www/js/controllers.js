var app = angular.module('starter.controllers', ['ngCordova']);

app.controller('ConnectionCtrl', function($scope) {
    var pairedDevices = [];
    $scope.pairedDevices = pairedDevices;

    document.addEventListener("deviceready", function () {
        $cordovaBluetoothSerial.isEnabled().then(function() {
            showList();
        }, function() {
            $cordovaBluetoothSerial.enable().then(function() {
                showList();
            }, function() {
                console.log('Bluetooth is still not Enabled');
            });
        });
    });

    function showList() {
    }
});

app.controller('MotionsCtrl', function($scope, $cordovaDeviceMotion, $cordovaBluetoothSerial) {
    var motions = [];
    $scope.motions = motions;

    var options = { frequency: 1000 };

    document.addEventListener("deviceready", function () {
        var watch = $cordovaDeviceMotion.watchAcceleration(options);
        watch.then(null, function(error) {}, function(result) {
            // var X = result.x;
            // var Y = result.y;
            // var Z = result.z;
            // var timeStamp = result.timestamp;
            motions.push(result);
        });
    });
});

app.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
