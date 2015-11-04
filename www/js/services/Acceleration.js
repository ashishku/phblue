(function() {
  var app = angular.module('phblue');
  app.factory('Acceleration', ['$cordovaDeviceMotion', function(q, acceleration) {
    return new Acceleration(q, acceleration);
  }]);

  function Acceleration(acceleration) {
    this.acceleration = acceleration;

    this.watch;
  }

  Acceleration.prototype.watchAcceleration = function(cb, options) {
    var that = this;
    var FILTERFACTOR = 0.3;
    var previous_parameters = {
      x: 0,
      y: 0,
      z: 0
    };

    options = options || {};
    options.frequency = options.frequency || 100;

    document.addEventListener('deviceready', function () {
      var watch = that.acceleration.watchAcceleration(options);
      watch.then(null, function(err) {
      }, function(acc) {
        var x = -acc.x;
        var y = -acc.y;
        var z = acc.z;

        var valuex = (x * FILTERFACTOR) + (previous_parameters.x * (1.0 - FILTERFACTOR));
        var valuey = (y * FILTERFACTOR) + (previous_parameters.y * (1.0 - FILTERFACTOR));
        var valuez = (z * FILTERFACTOR) + (previous_parameters.z * (1.0 - FILTERFACTOR));

        previous_parameters.x = valuex;
        previous_parameters.y = valuey;
        previous_parameters.z = valuez;

        cb({
          x: valuex,
          y: valuey,
          z: valuez,
          timeStamp: acc.timestamp
        });
      });

      that.watch = watch;
    });
  };
}());
