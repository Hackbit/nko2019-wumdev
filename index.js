const express = require('express');
const app = express();
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

app.use(express.static('./test'));

let users = {};

io.on('connection', socket => {
    console.log(`a User joined with socket id: ${socket.id}`);
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
            if(usersKey.find(a => a == id)) id = genId();
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
                        runSample(process.env.PROJECTID, args.join(' ').trim(), "en-US", async res => {
                            let display = res.queryResult.intent.displayName,
                                confidence = res.intentDetectionConfidence,
                                fulfillment = res.queryResult.fulfillmentText;;

                            if(display == "Question") {
                                let url = process.env.CUSTOMSEARCH_URI+args.join('+');
                                request(url, (e, res, body) => {
                                    if(e) console.log(e);
                                    body = JSON.parse(body);
                                    let first = body.items[0];
                                    
                                    io.to('General').emit('userMessage', {
                                        message: `${fulfillment} ${first.formattedUrl}`,
                                        by: "Bot",
                                        id: 101
                                    });
                                });
                                return;
                            } else if(display == 'Convert-Crypto') {
                                let from = res.queryResult.parameters["targetMonetarySpec"][0],
                                    to = res.queryResult.parameters["cryptocurrency"][0],
                                    amount = res.queryResult.parameters['amount'].toString();

                                let list = require('./cryplist.json');
                                let cryptoArr = Object.keys(list.crypto);
                                let fiatArr = Object.keys(list.fiat);
                                if(from.length > 3) {
                                    cryptoArr.forEach(a => {
                                        if(list[a].name.toLowerCase() == from.toLowerCase()) from = a;
                                    });
                                    fiatArr.forEach(a => {
                                        if(list[a].name.toLowerCase() == from.toLowerCase()) from = a;
                                    });
                                }
                                if(crypto.length > 3) {
                                    cryptoArr.forEach(a => {
                                        if(list[a].name.toLowerCase() == to.toLowerCase()) to = a;
                                    });
                                    fiatArr.forEach(a => {
                                        if(list[a].name.toLowerCase() == to.toLowerCase()) to = a;
                                    });
                                }
                                if(cryptoArr.find(a => a == crypto) || fiatArr.find(a => a == crypto)) {
                                    if(fiatArr.find(a => a == from) || cryptoArr.find(a => a == from)) {
                                        request(`http://api.coinlayer.com/api/convert?access_key=${process.env.APIKEY}&from=${from}&to=${to}&amount=${amount}`, (e, res, body) => {
                                            if(e) console.log(e);
                                            body = JSON.parse(body);

                                            io.to('General').emit('userMessage', {
                                                message: `${from} to ${to}: ${body.result} ${to}`,
                                                by: "Bot",
                                                id: 101
                                            });
                                        });
                                    }
                                }
                                return;
                            } else {
                                io.to('General').emit('userMessage', {
                                    message: fulfillment,
                                    by: "Bot",
                                    id: 101
                                });                          
                                return;
                            }
                        });
                    }
                }

                socket.to('General').broadcast.emit('userMessage', {
                    message: message,
                    by: users[id].username,
                    id
                });
            });

            socket.on("disconnect", async () => {
                console.log(`a User disconnected with socket id: ${socket.id}`)
                await socket.broadcast.emit("userDisconnect", users[id].username);
                delete users[id]
            });  
        }
    });
});

function genId() {
    return Math.floor(Math.random() * (1000 - 111)) + 111;
};

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 * @param {string} text
 * @param {string} lang
 * @param {function} callback
 */
async function runSample(projectId=null, text, lang="en-US", callback) {
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
    
    await sessionClient.detectIntent(request).then(res => {
        return callback(res[0]);
    });
  }
