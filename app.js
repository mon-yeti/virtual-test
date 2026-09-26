const express = require('express');
const server = require('http').createServer();

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


server.on('request', app)
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected', ws);
});

