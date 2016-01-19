// var config = require('./env.json');
// var fs = require('fs');
// var async = require("async");
// var exec = require('child_process').exec;
// var Git = require("nodegit");
// var path = require('path');
// var child;
//
// var parentDir =__dirname;
//
// var deployFolderName = 'test';
//
var cloneOptions = {};
cloneOptions.remoteCallbacks = {
    credentials: function(url, userName) {
        return NodeGit.Cred.sshKeyFromAgent(userName);
    },
    transferProgress: function(info) {
      return console.log(info);
    }
};
//
// cloneApps()
//
// function cloneApps() {
//   async.each(config.APPS,
//     function(app, callback){
//
//       repoPath = path.join(deployFolderName, app.name)
//       console.log(repoPath)
//       try {
//         // check if the app exists
//         fs.accessSync(repoPath, fs.F_OK);
//         callback();
//       } catch (e) {
//         console.log("cloning")
//         Git.Clone(app.repo, repoPath, cloneOptions)
//
//         // Look up this known commit.
//         .then(function(repo) {
//           // Use a known commit sha from this repository.
//           console.log(repo)
//         }).catch(function(err) { console.log(err); });
//       }
//     },
//     // 3rd param is the function to call when everything's done
//     function(err){
//       // All tasks are done now
//       console.log("start")
//     }
//   );
// }
//
// function startApp() {
//   child = exec("npm start", function (error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     } else {
//       console.log('starting app');
//     }
//   });
// }
var Git = require("nodegit");

Git.Clone("https://github.com/nodegit/nodegit", "flip", cloneOptions).then(function(repository) {
  // Work with the repository object here.
  return repository;
}).catch(function(err) { console.log(err); });
