(function() {
  var app = angular.module('phblue');

  app.directive('bubble', ['BlueTooth', function(bluetooth) {
    var bubble_half = 25;   // It is half of bubble div block to calculate new coordinates
    var panel_width = 0;
    var panel_height = 0;
    var cur_view = 'circle';

    return {
      templateUrl: 'templates/bubble.html',
      link: function(scope, ele, attr) {
        $(".block").css('top',(screen.height-400)/2 + 50)
                   .css('left',(screen.width-400)/2);
        panel_width = $('.panel').outerWidth();
        panel_height = $('.panel').outerHeight();
        attr.$observe('dir', function() {
          if(attr.dir && attr.dir !== '') {
            var dir = JSON.parse(attr.dir);

            var y = dir.x * -1;
            var x = dir.y;
            var z = dir.z;

            //spherical coordinates (r, theta, phi)
            var r = Math.sqrt(x*x + y*y +z*z);

            var theta = 0;
            var phi = 0;
            if (z === 0) {
                theta = x > 0 ? 90 : -90;
            }
            else {
                theta = parseInt(Math.atan(Math.sqrt(x*x + y*y)/z)*180/Math.PI);
            }
            if (x === 0) {
                phi = y > 0 ? 90:-90;
            }
            else {
                phi = parseInt((Math.atan(y/x))*180/Math.PI);
            }

            var angles = {
                r: r,
                theta: theta,
                phi : phi,
                x: x,
                y: y,
                z: z
            };

            // set skin at the beginning
            chooseScreen(angles);
          }
        });
      }
    };

    function chooseScreen(angles) {
      var rotate_angle = 0; // angle to rotate device's screen for 'bar' skin
      if (Math.abs(angles.theta) < 70) {
          switch_view('circle');
          rotate_angle = 0;
      }
      else {
          switch_view('bar');
          rotate_angle = angles.x<0 ? -90:90;
      }
      // set location of bubble box
      moveBubble(angles, rotate_angle);
    }

    function moveBubble(angles, rotate_angle) {
        // new offsets for bubble div
        var left = 0;
        var top = 0;
        switch(cur_view) {
            case 'circle':
                var length = Math.sqrt(angles.x * angles.x + angles.y * angles.y)*panel_width/2/angles.r;
                var angle1 = Math.atan2(angles.x, angles.y);
                left = panel_width/2 - bubble_half + length*Math.sin(angle1);
                top = panel_height/2 - bubble_half - length*Math.cos(angle1);
                break;
            case 'bar':
                $(".angle").html(Math.abs(angles.phi) + "&deg;"); // For bar view we set degree to info panel
                left = panel_width/2 - bubble_half - panel_width/180 * angles.phi;
                top = -bubble_half;
                break;
        }

        // Set new offsets
        $('.bubble').css('top', top)
                    .css('left', left);
        // Rotate panel for corresponding side
        block_transform(rotate_angle);

    }

    function block_transform(rotate_angle) {
      $('.block').css('-webkit-transform','rotate('+ rotate_angle + 'deg)')
        .css('-moz-transform','rotate('+ rotate_angle + 'deg)')
        .css('-o-transform','rotate('+ rotate_angle + 'deg)')
        .css('-ms-transform','rotate('+ rotate_angle + 'deg)')
        .css('transform','rotate('+ rotate_angle + 'deg)');
    }

    function switch_view(to) {
      $('.panel') .removeClass('panel_' + cur_view)
                  .addClass('panel_' + to);
      $('.center').removeClass('center_' + cur_view)
                  .addClass('center_' + to);
      $('.angle') .removeClass('angle_' + cur_view)
                  .addClass('angle_' + to);
      $('.shadow').removeClass('shadow_' + cur_view)
                  .addClass('shadow_' + to);
      cur_view = to;
    }
  }]);
}());
