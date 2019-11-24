const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const randExp = require('randexp');
const WebSocket = require('ws');

let server = app.listen(3000, () => {
    console.log("Server started");
});

const socket = require('socket.io');
let io = socket(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./public'));

let users = {};

io.on('connection', socket => {
    socket.join('General');
    socket.on('data', data => {
        if(!data.username) return socket.emit('error', { code: 0, msg: "Invalid username" });
        let usersKey = Object.keys(users);
        if(usersKey.find(a => a == data.username)) return socket.emit('error', { code: 3, msg: "user already used"})

        socket.to('General').broadcast.emit('userJoin', data.username);
        let id = genId();
        users[id] = {
            username: data.username,
            socketId: socket.id,
            id: id
        }

        socket.emit("clientData", {
            id: id
        });

        socket.on('message', async message => {
            socket.to('General').broadcast.emit('userMessage', {
                message: message,
                by: users[id].username
            });
        });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let data = JSON.parse(message);
    let event = data['e'];

    if (event === 'new_connect') {
      if (!Object.keys(users).includes(data['username'])) {
        users[data['username']] = data['id'];
        console.log('Registered user - %s', data['username']);
        ws.send(JSON.stringify({e: 'USER_REGISTERED', data}));
      }
      else {
        ws.send(JSON.stringify({e: 'ERROR', reason: 'USER_ALREADY_REGISTERED'}));
      }
    }
  });

  ws.send(JSON.stringify({e: 'USER_CONNECTED'}));
});

function genId() {
    return new randExp(/[0-9][0-9][0-9]/).gen();
}
