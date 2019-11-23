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
    socket.on('data', data => {
        if(!data.username) return socket.emit('error', { code: 0, msg: "Invalid username" });
        let id = genId();
        users[id] = {
            username: data.username,
            socketId: socket.id,
            id: id
        }

        socket.emit("clientData", {
            color: color(Math.floor(Math.random() * 20), 20),
            id: id,
            rooms: Object.keys(rooms)
        });

        // socket.on('changeRoom', async room => {
        //     let current = Object.keys(socket.rooms)[1];
        //     await socket.leave(current);
        //     joinRoom(socket, room)
        // });

        socket.on('message', async message => {
            // logic when message is sent
            let message = `${users[id].username} » ${message}`,
                timestamp = Date.now()

            socket.broadcast.emit('userMessage', {
                message: message,
                by: users[id].username,
                timestamp: timestamp
            });
        });
    });

    socket.on("disconnect", async () => {
        await socket.broadcast.emit("userDisconnect", users[id].username);
        delete users[id]
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

// /**
//  * 
//  * @param {SocketIO.Socket} socket 
//  * @param {String} room 
//  */
// function joinRoom(socket, room) {
//     let roomArr = Object.keys(rooms);
//     if(!roomArr.find(a => a == room)) return socket.emit('error', { code: 1, msg: "Invalid room"} );
//     if(rooms[room]["users"].find(a => a == users[id].id)) return;

//     await socket.join(room)
//     rooms[room]["users"].push(id);
// }