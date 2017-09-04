'use strict';

const JOHNNY_FILE = './res/johnny.js';
const SKETCH_FILE = './sketch/sketch.js';
const HEADER_FILE = './res/header.js';
const BODY_FILE = './res/body.js';
const FUNCTIONS_FILE = './res/functions.js';
const SERVER_PORT = 45588;

// Initialize Socket Server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const fs = require('fs');
const sp = require('serialport');

// Child Process for Johnny-Five and init
var spawn = require('child_process').spawn;
var johnnyScript = null;
initJohnny();

server.listen(SERVER_PORT, function(){
    console.log('[LOG] Listening on :' + SERVER_PORT);
});

app.use(express.static(__dirname));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client){
    console.log('[LOG] IDE is connected.');

    sp.list(function (err, ports) {
      ports.forEach(function(port) {
        console.log('[LOG] ' + port.comName + ': ' + port.manufacturer);
        client.emit('ports', port);
      });
    });

    client.on('execute', function(data){
        try {
            console.log('[LOG] Script File:\n' + data.code);

            fs.writeFile(BODY_FILE, data.code, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log('[LOG] The Body file was saved!');
            });
            fs.writeFile(SKETCH_FILE, data.sketch, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log('[LOG] The Sketch file was saved!');
            });
            restartJohnny(client);

        } catch (err) {
            console.error('[ERR] Failed to execute script.', err);
        }
    });

    initConsole(client);
});

function restartJohnny(client){
    johnnyScript.kill();

    var _code = '';
    fs.readFile(HEADER_FILE, 'utf8', function(err, data) {
      _code += data;
      fs.readFile(BODY_FILE, 'utf8', function(err, data) {
        _code += data;
        fs.readFile(FUNCTIONS_FILE, 'utf8', function(err, data) {
          _code += data;
          fs.writeFile(JOHNNY_FILE, _code, function(err) {
              console.log('[LOG] The Johnny file was created!');
              initJohnny();
              initConsole(client)
          });
        });
      });
    });
}

function initJohnny(){
    johnnyScript = spawn('node', [JOHNNY_FILE]);
    johnnyScript.stdin.setEncoding('utf-8');
    johnnyScript.stdout.pipe(process.stdout);
    johnnyScript.stderr.pipe(process.stderr);
}

function initConsole(client){
    johnnyScript.stdout.on('data', function(data) {
        client.emit('console', data.toString());
    });

    johnnyScript.stderr.on('data', function(data) {
        client.emit('console', data.toString());
    });
}
