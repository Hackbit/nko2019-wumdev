# BACKEND DOCUMENTATION

__Current Features:__
> One Room Support
> User Events (userJoin & userDisconnect)
> Real-Time Communication by chat (Server: message, Client: userMessage)
> Random Username Color (Hex color code)

## Setup

### Server

Install the dependencies
```js
npm i
```
Start the server
```js
npm start
or
node index.js
```

### Client

Import Socket.IO
```js
// Javascript/HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script> // Via CDN
// Node.js
const io = require('socket.io-client');
// ES6
import io from 'socket.io-client';
```
Connect to server & Events
```js
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
<script>
    // Initialize
    var socket = io('http://localhost:3000');
    socket.emit('data', function() { // Must be emitted first 
        username
    });
    socket.on('clientData', function(data) {
        id
    });

    // Send Message
    socket.emit('message', "message");

    // User Events
    socket.on('userMessage', function(msg) {
        msg {
            message
            by
        }
    });
		  
	socket.on('userJoin', function(u) {
        username
    });
		  
	socket.on('userDisconnect', u => {
        username
    });
</script>
```