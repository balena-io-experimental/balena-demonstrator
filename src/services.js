var config = require('../env.json');
var app = angular.module('myApp')
var childProcess = require('child_process')

var email = config.SDK_EMAIL
var pw = config.SDK_PW

// authenticate with resin sdk
var credentials = { email:email, password:pw };
resin.auth.login(credentials, function(error) {
  if (error != null) {
    throw error;
  }
  console.log("success authenticated with resin API")
});

// init pubnub
var pubnub = PUBNUB({
    subscribe_key: config.SUB,
    publish_key: config.PUB
});

// polls resin app for all devices data
app.factory('devicesService', function($timeout) {
	var data = {};
    (function poll() {
        resin.models.device.getAllByApplication(config.APP_NAME,function(error, devices) {
		  if (error != null) {
		    throw error;
		  }
		  data.resp = devices;
		  // console.log(devices)
		});  //

	   $timeout(poll, 500);
  	})();

  return {
	  data: data
	};
});

// Fail safe service to trigger events if needed
app.service('failSafeService', function($rootScope) {
	pubnub.subscribe({
	    channel: 'events',
	    message: function(m){
	    	console.log(m)
        // message must = eventname
	    	$rootScope.$broadcast(m)
	    },
	    error: function (error) {
	      // Handle error here
	      console.log(JSON.stringify(error));
	    }
	 });
});
