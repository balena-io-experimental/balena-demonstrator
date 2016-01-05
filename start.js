var config = require('./env.json');

var isWindows = require('is-windows');
var fs = require('fs');
var exec = require('child_process').exec;
var child;

var parentDir =__dirname;


try {
  fs.accessSync(parentDir + "/.." + "/simple-beast-fork", fs.F_OK);
    // check if slave repo exists
    console.log('slave-repo exists');
    startApp();
  } catch (e) {
    console.log('no slave-repo, cloning slave-repo');
    cloneSlave();
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
  child = exec("cd /" + parentDir + "/.. && git clone git@github.com:craig-mulligan/simple-beast-fork.git && cd simple-beast-fork && git remote add resin unicorn@git.resin.io:unicorn/microbeast.git", function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      startApp();
    }
  });
}
