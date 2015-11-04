(function() {
  angular.module('phblue', ['ionic', 'ngCordova'])
    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }

        window.plugins.insomnia.keepAwake();
      });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider.state('app', {
        url:         '/app',
        abstract:    true,
        templateUrl: 'templates/menu.html',
        controller:  'AppCtrl'
      })
      .state('app.connection', {
        url:   '/connection',
        views: {
          'menuContent': {
            templateUrl: 'templates/connection.html',
            controller:  'ConnectionCtrl'
          }
        }
      }).state('app.accelerometer', {
        url:   '/remote/accelerometer',
        views: {
          'menuContent': {
            templateUrl: 'templates/tab-motions.html',
            controller:  'MotionsCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/app/connection');
    });
}());
