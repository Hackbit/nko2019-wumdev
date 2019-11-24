const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const randExp = require('randexp');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const request = require('request');
require('dotenv').config();

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
    console.log("Server started, listening to port: "+port);
});

const socket = require('socket.io');
let io = socket(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./test'));

let users = {};

io.on('connection', socket => {
    socket.join('General');
    socket.on('data', data => {
        if(!data.username) return socket.emit('err', { code: 0, msg: "Invalid username" });
        let usersKey = Object.keys(users);
        let allowed = true;
        usersKey.forEach((a) => {
            if(users[a].username == data.username) {
                allowed = false;
                return socket.emit('err', { code: 1, msg: "user already used"});
            }
        });

        if(allowed) {
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
                let args = msgArr.slice(1, msgArr.length);

                if(cmd == '@bot') {
                    if(args.join(' ').length > 0) {
                        let res = runSample(process.env.PROJECTID, args.join(' '), "en-US");
                        let display = res.intent.displayName,
                            confidence = res.intentDetectionConfidence;
                            fulfillment;

                        if(display == 'Compliment') {
                            fulfillment = res.fulfillmentText;
                            socket.to('General').broadcast.emit('userMessage', {
                                message: fulfillment,
                                by: "Bot"
                            });
                        }
                        if(display == "Question") {
                            let url = process.env.CUSTOMSEARCH_URI+args.join('+');
                            request(url, (error, response) => {
                                
                            });
                        }
                    }
                }

                socket.to('General').broadcast.emit('userMessage', {
                    message: message,
                    by: users[id].username
                });
            });

            socket.on("disconnect", async () => {
                console.log('dc')
                await socket.broadcast.emit("userDisconnect", users[id].username);
                delete users[id]
            });  
        }
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
   
    return responses[0];
  }