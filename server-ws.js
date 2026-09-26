const express = require("express");
const server = require("http").createServer();
const app = express();
const PORT = 3000;

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(PORT, function () {
  console.log("Listening on " + PORT);
});

process.on("SIGINT", function () {
  wss.clients.forEach((client) => client.close());
  console.log("------");
  server.close();
  closeDatabase();
  process.exit(0);
});

const Database = require("better-sqlite3");
const db = new Database(":memory:");

db.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    count INTEGER,
    time TEXT
  )
`);

const insertVisitor = db.prepare(`
  INSERT INTO visitors (count, time)
  VALUES (?, datetime('now'))
`);

const selectVisitorCount = db.prepare("SELECT * FROM visitors");

/** Websocket **/
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;

  console.log("clients connected: ", numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("welcome!");
  }

  try {
    insertVisitor.run(numClients);
  } catch (err) {
    console.error(err);
  }

  ws.on("close", function close() {
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
    console.log("A client has disconnected");
  });

  ws.on("error", function error() {
    //
  });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  console.log("Broadcasting: ", data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
/** End Websocket **/

function getVisitors() {
  const row = selectVisitorCount.all();
  console.log(row);
}

function closeDatabase() {
  getVisitors();
  console.log("Closing database");
  db.close();
}
