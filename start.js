var config = require('./env.json');
var fs = require('fs');
var async = require("async");
var exec = require('child_process').exec;
var Git = require("nodegit");
var path = require('path');
var child;

var parentDir =__dirname;
var remoteName = 'resin'

var cloneOptions = {};
cloneOptions.remoteCallbacks = {
    credentials: function(url, userName) {
        return NodeGit.Cred.sshKeyFromAgent(userName);
    },
    transferProgress: function(info) {
      return console.log(info);
    }
};

function setUp() {
  async.each(config.APPS,
    function(app, callback){
      try {
        // check if the app exists
        fs.accessSync(app.name, fs.F_OK);
        callback();
      } catch (e) {
        console.log("cloning")
        Git.Clone(app.repo, path.join('apps', app.name), cloneOptions).then(function(repo) {
          // Work with the repository object here.
          Git.Remote.setUrl(repo, remoteName, config.REMOTE);
        }).catch(function(err) {
          console.log(err);
          Git.Repository.open(path.join('apps', app.name)).then(function(repo) {
            console.log(repo)
            Git.Remote.lookup(repo, remoteName, callback).then(function(remote) {
              if(remote) {
                Git.Remote.setUrl(repo, remoteName, config.REMOTE);
              } else {
                Git.Remote.create(repo, remoteName, config.REMOTE);
              }
            });
          }).catch(function(err) {
            console.log(err);
          });
        });
      }
    },
    // 3rd param is the function to call when everything's done
    function(err){
      // All tasks are done now
      console.log("start");
      startApp()
    }
  );
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

setUp()
