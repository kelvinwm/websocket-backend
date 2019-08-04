var express = require('express');
const signInModel = require('./models/authModel');
const Mongoose = require("mongoose");
const uri = "mongodb+srv://khnuser:0728306459@knhcluster-sqwui.mongodb.net/test?retryWrites=true&w=majority";

var app = express();
var expressWs = require('express-ws')(app);

app.use(function (req, res, next) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
});
try {
    Mongoose.connect(uri, { useNewUrlParser: true });
    console.log('Mongoose Connected');
} catch (error) {
    console.log(error);
}
CLIENTS = []
webSockets = {} // userID: webSocket
app.ws('/echo1/:userUID', function (ws, req) {
    console.log('Socket Connected');
    var userID = req.params['userUID']
    webSockets[userID] = ws

    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(webSockets))
    CLIENTS.push(req.params['userUID'])

    ws.on('message', function (msg) {
        console.log('received from ' + userID + ': ' + msg)
        var messageArray = JSON.parse(msg)
        console.log('to Array ' + messageArray[0])
        var toUserWebSocket = webSockets[messageArray[0]]
        console.log('to user ' + toUserWebSocket)
        // find the user starlord55 update him to starlord 88
        signInModel.findOneAndUpdate({ email: 'starlord88' },
            { password: messageArray[1] }, function (err, user) {
                if (err) throw err;
                // we have the updated user returned to us
                // console.log(user);
            });
        // get the user starlord58
        signInModel.find({ email: 'starlord88' }, function (err, user) {
            if (err) throw err;
            if (toUserWebSocket) {
                console.log('sent too ' + user)
                // toUserWebSocket.send(msg)
                toUserWebSocket.send(user.toString())
            }
        });
    });

    signInModel.find({ email: 'kevo2' }, function (err, user) {
        if (err) throw err;
        console.log(user)
        ws.send(user[0].toString());
    });
});

app.listen((process.env.PORT || 3030));
