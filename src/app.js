var app = angular.module('myApp', []).run(function ($rootScope) {
    $rootScope.activeView = "animation-wrapper";
});
var resin = require("resin-sdk");
var pty = require('pty.js');
var Terminal = require('term.js').Terminal;
var fs = require('fs-extra');

rows = parseInt(process.env.ROWS) || 20
cols = parseInt(process.env.COLS) || 80

function text2speech(filename){
  var fs = require('fs');
  var cp = require('child_process');

  var aplay = cp.spawn('aplay');
  console.log("speaking");
  fs.createReadStream('/usr/src/app/src/'+ filename +'.wav').pipe(aplay.stdin);
}

function objectify(array) {
  result = {}
  for (var i = 0; i < array.length; i++) {
    result[array[i]] = {};
  }
  return result;
}

function animationCtrl($scope, $rootScope, failSafeService, starterService) {
  //defaults
  $scope.animationText = '';
  $rootScope.activeView = "animation-wrapper";
  $scope.logo = 'resin-logo.png';
  // shows start button process
  $scope.start = true;

  $scope.start = function() {
    // starts the process
    $rootScope.$broadcast('start_selector');
    $scope.hasStarted = true;
  }

  $scope.$on('pre_start', function(event) {
    console.log('load');
    $scope.animationText = '';
    $rootScope.activeView = "animation-wrapper";
    $scope.logo = 'resin-logo.png';
    $scope.hasStarted = false;
  });

  $scope.$on('start', function(event) {
    $rootScope.activeView = "animation-wrapper";
    $scope.animationText = '';
    console.log("starting");
    $(".element").typed({
      strings: ["$ git push resin master"],
      typeSpeed: 25,
      onStringTyped: function() {
        setTimeout(function() {
          $rootScope.$broadcast('start_build');
        }, 1000);
      },
    });
   });

  $scope.$on('start_countdown', function(event) {
    $rootScope.activeView = "animation-wrapper";
    $scope.animationText = ''
    $(".element").typed({
      strings: ["YOU JUST UPDATED", 'A FLEET DEVICES', 'IN SEATTLE',
        " <b class='noise'>NICE !!!</b>"
      ],
      typeSpeed: 50,

      callback: function() {
        setTimeout(function() {
          // $rootScope.$broadcast('start_tts');
          $rootScope.$broadcast('pre_start');
        }, 5000);
      },
    });
  });

  $scope.$on('start_tts', function(event) {
    g = 0
    $rootScope.activeView = "animation-wrapper";
    $scope.animationText = '';
    $scope.logo = 'resin-logo.png';
    $(".element").typed({
      strings: ["LEVEL UNLOCKED","WELCOME TO DOCKERCON"],
      typeSpeed: 25,
      backDelay: 1000,
      onStringTyped: function() {
          setTimeout(function() {
            if (g == 0) {
              // text2speech('welcome');
              console.log('text2speech happens now')
            }
            ++g;
            console.log(g);
          }, 2000);
      },
    });
  });
}


function terminalCtrl($scope, $rootScope, failSafeService) {
  $scope.$on('start_build', function(event) {
    console.log('start_build')
    $rootScope.activeView = "tty-wrapper";
    var script = __dirname + '/push.sh'

    var command = pty.spawn('bash', [script], {
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
      setTimeout(function() {
        $rootScope.$broadcast('start_download');
      }, 2000);
    });
  });
}

function selectorCtrl($scope, $rootScope, failSafeService) {
  $scope.$on('start_selector', function(event) {
    $rootScope.activeView = "selector-wrapper";
    // declare image options it must have a corresponding raw file in the same dir;
    $scope.images = ["docker", "heroku", "resin"];
    $scope.select = function(image) {
      $scope.selection = image;
    };

    $scope.changeRepo = function(){
      fs.copy(__dirname + '/images/'+ $scope.selection + '.raw', '../simple-beast-demo/images/image.raw', function (err) {
        if ($scope.selection == null) {
          $scope.warning = "you first need to select an image"
          return;
        } else {
          if (err) return console.error(err)
          console.log("code change success!")
          $rootScope.$broadcast('start_build');
        }
      }) // copy image file
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

function applauseCtrl($scope, $rootScope, devicesService, failSafeService) {
  $scope.$on('start_applause', function(event) {
    $rootScope.activeView = "applause-wrapper";
    $scope.devices = devicesService.data;

    var devices = $scope.devices.resp
    var channel_list = []
    var unsubscribed = []
    $scope.meters = {};

    pubnub.publish({
      channel: 'events',
      message: 'ready',
      callback: applauseMeter()
    });

    function applauseMeter() {
      for (i = 0; i < devices.length; i++) {
        if (devices[i].is_online) {
            channel_list.push(devices[i].uuid);
        }
        // $scope.meters.
        if (i == devices.length - 1) {
          console.log("loop fin")
            // subscribe to channels
          $scope.meters = objectify(channel_list);
          pubnub.subscribe({
            channel: channel_list,
            message: function(m, env, ch) {
              $scope.$apply(function() {
                $scope.meters[ch].current_level = m.current_level;
                $scope.meters[ch].current_progress = m.current_progress
              });
              // check reaches limit
              if ($scope.meters[ch].current_progress == 100) {
                console.log("unsubscribing: " + ch)
                pubnub.unsubscribe({
                  channel: ch,
                });
                unsubscribed.push(ch);
                $scope.$apply(function() {
                  $scope.meters[ch].finnished = "fin"
                  $scope.meters[ch].current_level = 0
                });
                if (unsubscribed.length == channel_list.length) {
                  setTimeout(function() {
                    $rootScope.$broadcast('start_tts');
                  }, 2000)
                }
              }

            },
            error: function(error) {
              // Handle error here
              console.log(JSON.stringify(error));
            }
          });
        }
      }
    }
  });
}
