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
