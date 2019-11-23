const client = new WebSocket('ws://localhost:3000');
client.onopen = function() {
  console.log('Connected!');
  let username = '';
  while (username === '')
    username = prompt('What would you like your username to be?','');
  client.send(JSON.stringify({e: 'new_connect', username, id: Math.ceil(Math.random() * 888) + 111}));
};

client.onmessage = function(message) {
  console.log(message.data);
  let data = JSON.parse(message.data);
  let event = data['e'];
  if (event === 'USER_REGISTERED') {
    alert('CONNECTED!');
  }
  else if (event === 'ERROR') {
    if (data['reason'] === 'USER_ALREADY_REGISTERED') {
      let username = '';
      while (username === '')
        username = prompt('Username is already taken! Please enter a new one.');
      client.send(JSON.stringify({e: 'new_connect', username, id: Math.ceil(Math.random() * 888) + 111}));
    }
  }
};