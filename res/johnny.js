const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
server.listen(45589);

var five = require("johnny-five");
// Board Setup
var board = new five.Board({port: "COM4"});

var count = 128;
var input = 0;

function setup(){
    pinMode(11, PWM);
    pinMode(1, ANALOG);
    pinMode(13, OUTPUT);
}

// Loop
function loop(){
    analogWrite(11, count);
    input = analogRead(1);

    writeSocket('input', input); // or io.emit()
}

// Socket Event
function socketEvent(socket){
    socket.on('socket', function(data){
        count = data.brightness;
    });
}
// Functions
board.on("ready", function(){
    setup();
    setInterval(loop, 50);
});

var PWM = five.Pin.PWM;
var INPUT = five.Pin.INPUT;
var OUTPUT = five.Pin.OUTPUT;
var ANALOG = five.Pin.ANALOG;
var analogValues = [];
var digitalValues = [];

function pinMode(_pin, _mode){
    board.pinMode(_pin, _mode);

    if(_mode == ANALOG){
        board.analogRead(_pin, function(_value){
            analogValues[_pin] = _value;
        });
    }
    if(_mode == ANALOG){
        board.digitalRead(_pin, function(_value){
            digitalValues[_pin] = _value;
        });
    }
}

function analogWrite(_pin, _value){
    return board.analogWrite(_pin, _value);
}

function digitalWrite(_pin, _value){
    return board.digitalWrite(_pin, _value);
}

function analogRead(_pin){
    return analogValues[_pin];
}

function digitalRead(_pin){
    return digitalValues[_pin];
}

io.on('connection', function(socket){
    if(typeof socketEvent == 'function'){
        socketEvent(socket);
    }
});

function writeSocket(_tag, _data){
    return io.emit(_tag, _data);
}
