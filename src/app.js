var config = require('../env.json');
var app = angular.module('myApp', []).run(function ($rootScope) {
    $rootScope.activeView = "animation-wrapper";
});
var resin = require("resin-sdk");
var pty = require('pty.js');
var Terminal = require('term.js').Terminal;
var fs = require('fs-extra');
var isWindows = require('is-windows');

var w = window.innerWidth;
var h = window.innerHeight;

function objectify(array) {
  result = {}
  for (var i = 0; i < array.length; i++) {
    result[array[i]] = {};
  }
  return result;
}

function animationCtrl($scope, $rootScope, failSafeService) {
  //defaults
  $scope.animationText = '';
  $rootScope.activeView = "animation-wrapper";
  $scope.logo = config.LOGO;
  // shows start button process
  $scope.start = true;

  $scope.start = function() {
    // starts the process
    $rootScope.$broadcast('start_selector');
    $scope.hasStarted = true;
  }

  $scope.$on('pre_start', function(event) {
    console.log('load');
    $rootScope.activeView = "animation-wrapper";
    $scope.logo = config.LOGO;
    $scope.hasStarted = false;
  });

  $scope.$on('commit', function(event, selection) {
    console.log(event)
    $rootScope.activeView = "animation-wrapper";
    console.log("commiting");
    $(".element").typed({
      strings: ["$ git commit -a -m '" + config.HEADING.commitMsg + "'", "$ git push resin master"],
      typeSpeed: 25,
      callback: function() {
        setTimeout(function() {
          $('.animation h1').html('<span class="element"></span>');
          $rootScope.$broadcast('start_build', selection);
        }, 2000);
      },
    });
   });

  $scope.$on('start_countdown', function(event) {
    $rootScope.activeView = "animation-wrapper";
    $(".element").typed({
      strings:  config.HEADING.congrats,
      typeSpeed: 50,

      callback: function() {
        setTimeout(function() {
          $('.animation h1').html('<span class="element"></span>');
          $rootScope.$broadcast('pre_start');
        }, 5000);
      },
    });
  });
}


function terminalCtrl($scope, $rootScope, failSafeService) {
  $scope.$on('start_build', function(event, selection) {

    rows = parseInt(config.ROWS) || Math.ceil(h/24) //makes the term.js responsive-ish
    cols = parseInt(config.COLS) || Math.ceil(w/0.5) //makes the term.js responsive-ish

    console.log(rows + " " + cols)
    $rootScope.activeView = "tty-wrapper";
    // run push script and pass path to simple-beast-demo
    var script = __dirname + '/push.sh';

    var command = pty.spawn("bash", [script, selection, config.HEADING.commitMsg], {
      name: 'xterm-color',
      cols: cols,
      rows: rows,
    });

    var term = new Terminal({
      cols: cols,
      rows: rows,
      screenKeys: true,
      // useStyle: true,
    });

    command.on('data', function(data) {
      console.log(data);
    });

    term.open(document.getElementById('tty'));
    command.pipe(term);

    command.on('exit', function () {
        $rootScope.$broadcast('start_download');
    });
  });
}

function selectorCtrl($scope, $rootScope, failSafeService) {
  $scope.$on('start_selector', function(event) {
    $rootScope.activeView = "selector-wrapper";
    $scope.images = []
    $scope.heading = config.HEADING.selection
    if (!config.PICTURE_DEMO) {
      // check if we are one app or many
      for (index in config.APPS) {
          $scope.images.push(config.APPS[index].name)
      }
    } else {
      // working with single image app
      $scope.images = config.IMAGES;
    }

    // declare image options it must have a corresponding raw file in the same dir;
    $scope.select = function(target) {
      $scope.selection = target;
    };

    $scope.changeRepo = function(){
      if (!config.PICTURE_DEMO) {
        console.log($scope.selection)
        $rootScope.$broadcast('commit', $scope.selection);
      } else {
        fs.copy(__dirname + '/images/'+ $scope.selection + '.raw', '../' + config.APPS[0].name + '/images/image.raw', function (err) {
          if ($scope.selection == null) {
            $scope.warning = "you first need to select an image"
            return;
          } else {
            if (err) return console.error(err)
            console.log("code change success!")
            $rootScope.$broadcast('commit', config.APPS[0].name);
          }
        }) // copy image file
      }
    }
  });
}

function devicesCtrl($scope, $rootScope, devicesService, failSafeService) {
  $scope.$on('start_download', function(event) {
    console.log("download starting");
    $rootScope.activeView = "devices-wrapper";
    $scope.devices = devicesService.data;

    console.log(devicesService.data.resp);
    var startedDownloading = false;

    $scope.$watch('devices', function(newDevices, oldDevice) {

      var allIdle = newDevices.resp.every(Idle)

      var Downloading = newDevices.resp.some(downloading)

      var allDownloading = newDevices.resp.every(downloading)

      function downloading(device) {
        if (device.status == "Downloading") {
          return true;
        }
      }

      function Idle(device) {
        if (device.status == "Idle") {
          return true;
        }
      }

      if (Downloading) {
        console.log("started downloading");
        startedDownloading = true;
      }

      if (startedDownloading && allIdle) {
          console.log("ready");
          console.log('download complete');
          startedDownloading = false
          $rootScope.$broadcast('start_countdown');
      }
    }, true);
  });
}
