var socket = io.connect('http://143.248.250.92:45589');

var brightness = 0;
var potentiometer = 0;

function setup(){
    createCanvas(480, 480);
}

function draw(){
    background(0);
    
    stroke(255,0,0);
    line(mouseX, 0, mouseX, height);
    
    textSize(255);
    fill(255,0,0);
    noStroke();
    brightness = parseInt(constrain(map(mouseX, 0, width, 0, 255), 0, 255));
    text(brightness, 0, height);
    text(potentiometer, 0, height/2);
}

function mouseMoved(){
    socket.emit('socket', {brightness: brightness});
}

socket.on('input', function(data){
    potentiometer = parseInt(data);
});