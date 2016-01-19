var config = require('./env.json');
var fs = require('fs');
var async = require("async");
var exec = require('child_process').exec;
var child;

var parentDir =__dirname;

check()

function startApp() {
  child = exec("npm start", function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      console.log('starting app');
    }
  });
}

function check() {
  async.each(config.APPS,
    function(app, callback){
      try {
        // check if the app exists
        fs.accessSync(parentDir + "/.." + "/" + app.name, fs.F_OK);
        callback();
      } catch (e) {
        child = exec("cd /" + parentDir + "/.. && git clone " + app.repo + " " + app.name + "&& cd " + app.name + " && git remote add resin " + config.REMOTE, function (error, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
          callback();
        });
      }
    },
    // 3rd param is the function to call when everything's done
    function(err){
      // All tasks are done now
      startApp();
    }
  );
}
