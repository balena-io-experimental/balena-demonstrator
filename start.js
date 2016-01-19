var config = require('./env.json');
var fs = require('fs');
var exec = require('child_process').exec;
var child;

var parentDir =__dirname;


try {
  fs.accessSync(parentDir + "/.." + "/" + config.APPS[0].name, fs.F_OK);
  // check if slave repo exists
  console.log('slave-repo exists');
  startApp();
} catch (e) {
  console.log('no slave-repo, cloning slave-repo');
  cloneSlave();
  startApp();
}

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

function cloneSlave() {
  console.log("clone " +  config.APPS)
  for (index in config.APPS) {
    child = exec("cd /" + parentDir + "/.. && git clone " + config.APPS[index].repo + " " + config.APPS[index].name + "&& cd " + config.APPS[index].name + " && git remote add resin " + config.REMOTE, function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }
}
