var app = angular.module('myApp')
var childProcess = require('child_process')

var email = process.env.SDK_EMAIL || "unicorn@resin.io"
var pw = process.env.SDK_PW || "resin.io"

var credentials = { email:email, password:pw };

resin.auth.login(credentials, function(error) {
  if (error != null) {
    throw error;
  }
  console.log("success authenticated with resin API")
});

var pubnub = PUBNUB({
    subscribe_key: process.env.SUB,
    publish_key: process.env.PUB
});

// polls resin app for all devices data
app.factory('devicesService', function($timeout) {
	var data = {};
    (function tick() {
        resin.models.device.getAllByApplication(process.env.APP_NAME,function(error, devices) {
		  if (error != null) {
		    throw error;
		  }
		  data.resp = devices;
		  // console.log(devices)
		});  //

	$timeout(tick, 500);
  	})();

  	return {
	   data: data
	};
});

// Fail safe to trigger events if needed
app.service('failSafeService', function($rootScope) {
	pubnub.subscribe({
	    channel: 'events',
	    message: function(m){
	    	console.log(m)
	    	$rootScope.$broadcast(m)
	    },
	    error: function (error) {
	      // Handle error here
	      console.log(JSON.stringify(error));
	    }
	 });
});

var ArduinoFirmata = require('arduino-firmata');
var arduino = new ArduinoFirmata();

arduino.connect(); // use default arduino


app.service('starterService', function($rootScope) {
	arduino.on('connect', function() {

	  console.log("board version" + arduino.boardVersion);

	  arduino.pinMode(6, ArduinoFirmata.INPUT);

	  arduino.on('digitalChange', function(e) {
	    // console.log("pin" + e.pin + " : " + e.old_value + " -> " + e.value);
	    if (e.value == true) {
        setTimeout(function() {
          console.log('start this thang')
  	      $rootScope.$broadcast("start");
        }, 10000);
	    }
	  });

	});
});
