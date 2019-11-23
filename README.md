# BACKEND DOCUMENTATION

__Current Features:__
> One Room Support
> User Events (userJoin & userDisconnect)
> Real-Time Communication by chat (Server: message, Client: userMessage)
> Random Username Color (Hex color code)

## Setup

### Server

Install dependencies
```js
npm i
```
Defining the dependencies
```js
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const randExp = require('randexp');
...
server.listen(3000); // Listen to port 3000
```
(Optional) Set the front-end HTML/CSS/JS
```js
app.use(express.static('./public'))
or
app.get('/', (req, res) => res.sendFile(__dirname+'/public/index.html'))
```
Use Socket.IO
```js
io.on('connection', socket => {
    socket.join('General'); // Make sure the user is connected to a room
    socket.on('data', ...);
});
```
Socket User Data Event Listener
```js
socket.on('data', data => {
    if(!data.username) return socket.emit('error', { code: 0, msg: "Invalid username" });
		
    socket.to('General').broadcast.emit('userJoin', data.username); // UserJoin Event
}
```
Register/Save user to a Global Variable
```js
let users = {};
...
let id = genId(); // Generate an Unique ID
let randColor = color(Math.floor(Math.random() * 20), 20); // Generate random color
users[id] = {
    username: data.username,
    socketId: socket.id,
    id: id,
    color: randColor
}

socket.emit("clientData", { // Send the date to the client
    color: randColor,
    id: id
});
```
Message Listener & Broadcast Message
```js
socket.on('message', async message => {
    socket.to('General').broadcast.emit('userMessage', {
        message: message,
        by: users[id].username,
        color: randColor
    });
});
```
Disconnect Event Listener & Broadcast User Disconnection
```js
socket.on("disconnect", async () => {
    await socket.broadcast.emit("userDisconnect", users[id].username);
    delete users[id] // Delte the user from the Global Variable
});
```

### Client