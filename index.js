const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const randExp = require('randexp');

let server = app.listen(3000);

const socket = require('socket.io');
let io = socket(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./public'));
let users = {};

io.on('connection', socket => {
    socket.on('data', data => {
        if(!data.username) return socket.emit('error', { msg: "Invalid username" });
        socket.emit("clientData", {
            color: color(Math.floor(Math.random() * 20), 20),
            id: genId()
        });

        socket.on('message', message => {
            // logic when message is sent
        });
    });
});

function color(length, maxLength) {
  var i = (length * 255) / maxLength;
  var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
  var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
  var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function genId() {
    return new randExp(/[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{6}/).gen();
}