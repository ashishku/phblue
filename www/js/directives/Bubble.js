(function() {
  var app = angular.module('phblue');

  app.directive('bubble', ['BlueTooth', '$interval', function(bluetooth, $interval) {
    var bubble_half = 25;   // It is half of bubble div block to calculate new coordinates
    var panel_width = 0;
    var panel_height = 0;

    var angles = {
      theta: 0, deg: 0
    };

    var bubble;

    return {
      templateUrl: 'templates/bubble.html',
      link: function(scope, ele, attr) {
        $('.block').css('top',(screen.height-275)/2);
        $('.block').css('left',(screen.width-275)/2);

        panel_width  = $('.panel').outerWidth();
        panel_height = $('.panel').outerHeight();

        bubble = $('.bubble');

        $interval(function () {
          bluetooth.sendMsg('T' + angles.theta + 'D' + Math.floor(angles.deg * 100) / 100);
        }, 100);

        attr.$observe('dir', function() {
          if(attr.dir && attr.dir !== '') {
            var dir = JSON.parse(attr.dir);

            var y = dir.x * -1;
            var x = dir.y;
            var z = dir.z;

            var r = Math.sqrt(x*x + y*y +z*z);
            var theta  = parseInt(Math.atan(Math.sqrt(x*x + y*y)/z)*180/Math.PI);
            var deg    = Math.atan2(x, y);
            var length = Math.sqrt(angles.x * angles.x + angles.y * angles.y)*panel_width/2/angles.r;

            angles = {
              theta: theta,   deg: deg,   l: length,
              r: r,           x: x,       y: y
            };

            moveBubble(angles);
          }
        });
      }
    };

    function moveBubble(angles) {
      var left = panel_width/2  - bubble_half + angles.l * Math.sin(angles.deg);
      var top  = panel_height/2 - bubble_half - angles.l * Math.cos(angles.deg) + 2;

      bubble.css('left', left);
      bubble.css('top', top);
    }
  }]);
}());
