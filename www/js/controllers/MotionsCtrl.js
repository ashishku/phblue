(function() {
  var app = angular.module('phblue');

  app.controller('MotionsCtrl', ['$scope', 'Acceleration', 'BlueTooth', MotionsCtrl]);

  function MotionsCtrl(scope, acceleration, bluetooth) {
    scope.vm = this;
    acceleration.watchAcceleration(function(dir) {
      scope.vm.direction = dir;
    });
  }
}());
