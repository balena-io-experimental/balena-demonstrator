var app = angular.module('myApp', []);
var resin = require("resin-sdk");
var pty = require('pty.js');
var Terminal = require('term.js').Terminal;

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

function hideOthers(classy) {
  $("." + classy).show();
  $("." + classy).siblings().hide();
}


rows = parseInt(process.env.ROWS) || 40
cols = parseInt(process.env.COLS) || 200

function animationCtrl($scope, $rootScope, failSafeService, starterService) {
  $scope.$on('pre_start', function(event) {
    console.log('load');
    hideOthers('loading-wrapper');
    $('.loading-wrapper').html('<div class="logo loading"><img src="static/images/resin-logo.png"></div>')
  });

  $scope.$on('start', function(event) {
    hideOthers('animation-wrapper');
    $(".animation").html('<h1><span class="element"></span></h1>');
    console.log("starting")
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
    hideOthers('animation-wrapper');
    $(".animation").html('<h1><span class="element"></span></h1>');
    $(".element").typed({
      strings: ["3", "2", "1",
        "MAKE SOME <b class='noise'>NOISE!!!</b>"
      ],
      typeSpeed: 50,

      callback: function() {
        setTimeout(function() {
          $rootScope.$broadcast('start_applause');
        }, 2000);
      },
    });
  });

  $scope.$on('start_tts', function(event) {
    g = 0
    hideOthers('animation-wrapper');
    $(".animation").html(
            '<img class="docker-logo" src="static/images/docker-logo.png"><h1><span class="element"></span></h1>'
          );
    $(".element").typed({
      strings: ["LEVEL UNLOCKED","WELCOME TO DOCKERCON"],
      typeSpeed: 25,
      backDelay: 1000,
      onStringTyped: function() {
          setTimeout(function() {
            if (g == 0) {
              text2speech('welcome');
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
    hideOthers('tty-wrapper');
    var script = __dirname + '/start.sh'

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
      // console.log(data);
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

function devicesCtrl($scope, $rootScope, devicesService, failSafeService) {
  $scope.$on('start_download', function(event) {
    console.log("download starting");
    hideOthers('devices-wrapper');
    $scope.devices = devicesService.data;

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
    hideOthers('applause-wrapper');
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
