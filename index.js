const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const randExp = require('randexp');
const WebSocket = require('ws');

let server = app.listen(3000, ()=>{
  console.log('Server started');
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./public'));

const wss = new WebSocket.Server({server});

let users = {};

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

/**
 *
 * @param {Number} length
 * @param {Number} maxLength
 */
function color(length, maxLength) {
  let i = (length * 255) / maxLength;
  let r = Math.round(Math.sin(0.024 * i) * 127 + 128);
  let g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
  let b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function genId() {
  return new randExp(/[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{6}/).gen();
}
