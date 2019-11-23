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
// let rooms = {
//     "General": {
//         "users": []
//     }
// };

io.on('connection', socket => {
    socket.join('General');
    socket.on('data', data => {
        if(!data.username) return socket.emit('error', { code: 0, msg: "Invalid username" });

        socket.to('General').broadcast.emit('userJoin', data.username);
        let id = genId();
        let randColor = color(Math.floor(Math.random() * 20), 20);
        users[id] = {
            username: data.username,
            socketId: socket.id,
            id: id
        }

        socket.emit("clientData", {
            color: randColor,
            id: id
        });

        socket.on('message', async message => {
            socket.to('General').broadcast.emit('userMessage', {
                message: message,
                by: users[id].username,
                color: randColor
            });
        });

        socket.on("disconnect", async () => {
            await socket.broadcast.emit("userDisconnect", users[id].username);
            delete users[id]
        });
    });
});

/**
 * 
 * @param {Number} length 
 * @param {Number} maxLength 
 */
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