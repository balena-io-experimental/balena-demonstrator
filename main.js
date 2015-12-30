var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  process.env.PUB = 'pub-c-50c523d1-e9c5-4e13-b7f7-1383a3ca4645'
  process.env.SUB = 'sub-c-3bd403c8-0ec0-11e5-a5c2-0619f8945a4f'

  process.env.REMOTE = 'unicorn@git.resin.io:unicorn/microbeast.git'
  process.env.SDK_EMAIL = 'unicorn@resin.io'
  process.env.SDK_PW = 'resin.io'
  process.env.APP_NAME = 'microBeast'
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});
  // mainWindow = new BrowserWindow({"fullscreen": true, "auto-hide-menu-bar": true});
  // and load the index.html of the app.

  mainWindow.loadUrl('file://' + __dirname + '/src/index.html');

  // Open the DevTools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
