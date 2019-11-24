const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const randExp = require('randexp');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const dffUtils = require('dialogflow-fulfillment-utils');

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
    console.log("Server started, listening to port: "+port);
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
            let msgArr = message.split(' ');
            let cmd = msgArr[0];
            let args = msgArr.slice(1);
            if(cmd == '@bot') {
                let res = runSample(process.env.PROJECTID, text, "en-US");
            }

            socket.to('General').broadcast.emit('userMessage', {
                message: message,
                by: users[id].username
            });
        });

        socket.on("disconnect", async () => {
            await socket.broadcast.emit("userDisconnect", users[id].username);
            delete users[id]
        });
    });
});

function genId() {
    return new randExp(/[0-9][0-9][0-9]/).gen();
}

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 * @param {string} text
 * @param {string} lang
 */
async function runSample(projectId=null, text, lang="en-US") {
    if(!projectId) throw new Error("Invalid projectId")
    const sessionId = uuid.v4();

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: lang,
        },
      },
    };
   
    const responses = await sessionClient.detectIntent(request);
    console.log(responses[0])
   
    var messages = dffUtils.getMessages(responses);
    return responses[0];
  }