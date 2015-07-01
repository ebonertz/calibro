
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path;
var path = require('path'),
    config = require('./config');

var childArgs = [
    '--disk-cache=no',
    //path.join(__dirname, 'angular-phantom.js'),
    'angular-phantom.js',
    '8888',
    config.serverPath,
    //'some other argument (passed to phantomjs script)'
]

var spawn = require('child_process').spawn;

module.exports = function(){
    var child = spawn(binPath, childArgs);

    console.log("Starting up Phantom.js")

    child.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    child.on('close', function(code, signal) {
        // process exited and no more data available on `stdout`/`stderr`
    });

    return child;
}
