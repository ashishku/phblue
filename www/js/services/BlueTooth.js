(function() {
  var app = angular.module('phblue');
  app.factory('BlueTooth', ['$q', '$cordovaBluetoothSerial', function(q, bluetooth) {
    return new BlueTooth(q, bluetooth);
  }]);

  function BlueTooth(q, bluetooth) {
    this.q = q;
    this.bluetooth = bluetooth;

    this.connection = {
      enabled: false,
      connected: false,
      connectedTo: {}
    };
  }

  BlueTooth.prototype.isConnectedTo = function (device) {
    return (this.connection.connected && this.connection.connectedTo.address === device.address);
  };

  BlueTooth.prototype.sendMsg = function(msg) {
    var that = this;
    console.log(msg);
    if(that.connection.connected) {
      that.bluetooth.write(msg, function() {
        console.log('S: [' + msg + ']');
      }, function () {
        console.log('F: [' + msg + ']');
      });
    }
  };

  BlueTooth.prototype.enable = function() {
    var that = this;
    var deferred = this.q.defer();

    document.addEventListener('deviceready', function () {
      that.bluetooth.isEnabled().then(function () {
        that.connection.enabled = true;
        deferred.resolve();
      }, function () {
        that.bluetooth.enable().then(function () {
          that.connection.enabled = true;
          deferred.resolve();
        }, function () {
          that.connection.enabled = false;
          deferred.reject();
        });
      });
    });

    return deferred.promise;
  };
  BlueTooth.prototype.list = function() {
    var that = this;
    var deferred = this.q.defer();

    document.addEventListener('deviceready', function () {
      if(that.connection.enabled) {
        that.bluetooth.list().then(function (data) {
          deferred.resolve(data);
        }, function () {
          deferred.reject('Error in listing devices');
        });
      }
      else {
        deferred.reject('BlueTooth not enabled.');
      }
    });

    return deferred.promise;
  };

  BlueTooth.prototype.discoverUnpaired = function() {
    var that = this;
    var deferred = this.q.defer();

    document.addEventListener('deviceready', function () {
      if(that.connection.enabled) {
        that.bluetooth.discoverUnpaired().then(function (data) {
          deferred.resolve(data);
        }, function () {
          deferred.reject('Error in listing devices');
        });
      }
      else {
        deferred.reject('BlueTooth not enabled.');
      }
    });

    return deferred.promise;
  };

  BlueTooth.prototype.connect = function(device, cb) {
    var that = this;
    var deferred = this.q.defer();

    document.addEventListener('deviceready', function () {
      if(that.connection.enabled) {
        that.bluetooth.connect(device.address).then(function () {
          that.connection.connected = true;
          that.connection.connectedTo = device;

          cb();
          deferred.resolve();
        }, function (error) {
          that.connection.connected = false;
          that.connection.connectedTo = {};

          cb();
          deferred.reject(error);
        });
      }
      else {
        deferred.reject('BlueTooth not enabled.');
      }
    });

    return deferred.promise;
  };
}());
