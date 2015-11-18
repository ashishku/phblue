(function() {
  var app = angular.module('phblue');

  app.directive('bubble', ['BlueTooth', '$interval', function(bluetooth, $interval) {
    var bubble_half = 25;   // It is half of bubble div block to calculate new coordinates
    var panel_width = 0;
    var panel_height = 0;

    var angles = {
      data: {
        left: 0,
        len: 0,
        top: 0
      }
    };
    var preAngles = {
      data: {
        left: 0,
        len: 0,
        top: 0
      }
    };

    var bubble;

    return {
      templateUrl: 'templates/bubble.html',
      link: function(scope, ele, attr) {
        var block = $('.block');
        block.css('top',(screen.height-275)/2);
        block.css('left',(screen.width-275)/2);

        var panel = $('.panel');
        panel_width  = panel.outerWidth();
        panel_height = panel.outerHeight();

        bubble = $('.bubble');

        //$interval(function () {
        //  bluetooth.sendMsg('M' + getSpeedText(angles.data.len, angles.data.top) + getDirText(angles.data.left));
        //}, 75);


        $interval(function () {
          if(changeInDir(preAngles.data.top, angles.data.top) || outSideLimit(preAngles.data.len, angles.data.len, 3)) {
            preAngles.data.top = angles.data.top;
            preAngles.data.len = angles.data.len;
            var msg = getSpeedText(angles.data.len, angles.data.top);
            if (msg) {
              bluetooth.sendMsg(msg);
            }
          }
        }, 75);
        $interval(function () {
          if(outSideLimit(preAngles.data.left, angles.data.left, 3)) {
            preAngles.data.left = angles.data.left;
            var msg = getDirText(angles.data.left);
            if (msg) {
              bluetooth.sendMsg(msg);
            }
          }
        }, 75);

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
              r: r,           x: x,       y: y,
              z: z
            };

            moveBubble(angles);
          }
        });
      }
    };

    function changeInDir(p, c) {
      var pD = (p > 0) ? true : false;
      var cD = (c > 0) ? true : false;

      return (pD !== cD);
    }

    function outSideLimit(p, c, d) {
      var p1 = p - d;
      var p2 = p + d;

      return (p1 > c || p2 < c);
    }

    function moveBubble(angles) {
      var left = panel_width/2  - bubble_half + angles.l * Math.sin(angles.deg);
      var top  = panel_height/2 - bubble_half - angles.l * Math.cos(angles.deg) + 2;

      bubble.css('left', left);
      bubble.css('top', top);

      angles.data = {
        left: left - 101,
        top: top - 101,
        len: angles.l
      }
    }

    function getSpeedText(num, dir) {
      var text;

      num = Math.floor(num);

      if(dir < 0) {
        text = 'F';
      }
      else {
        text = 'B';
      }

      if(num < 16) {
        return 'STOP\n';
        //return 'X000';
      }

      //if(num < 100) {
      //  text += '0';
      //}
      //if(num < 10) {
      //  text += '0';
      //}

      text += num;
      text += '\n';

      return text;
    }
    function getDirText(num) {
      var text;

      num = Math.floor(num);

      if(num < 0) {
        text = 'L';
        num = num * -1;
      }
      else {
        text = 'R';
      }

      if(num < 16) {
        //return 'X000';
        return false;
      }

      //if(num < 100) {
      //  text += '0';
      //}
      //if(num < 10) {
      //  text += '0';
      //}

      text += num;
      text += '\n';

      return text;
    }
  }]);
}());
