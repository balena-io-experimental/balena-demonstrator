var config = require('./env.json');
var fs = require('fs');
var exec = require('child_process').exec;
var child;

var parentDir =__dirname;


try {
  fs.accessSync(parentDir + "/.." + "/" + config.SLAVES[0].name, fs.F_OK);
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
  console.log("clone " +  config.SLAVES)
  for (index in config.SLAVES) {
    child = exec("cd /" + parentDir + "/.. && git clone " + config.SLAVES[index].repo + " " + config.SLAVES[index].name + "&& cd " + config.SLAVES[index].name + " && git remote add resin " + config.REMOTE, function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }
}
