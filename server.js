const express = require('express');
const http = require('http');
const path = require('path');
const { createBareServer } = require('@tomphttp/bare-server-node');

const app = express();
const server = http.createServer(app);
const bareServer = createBareServer('/bare/');

// Serve UV static files
app.use('/uv', express.static(path.join(__dirname, 'public/uv')));

// Serve main public folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle bare server requests
server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`\n🐾 Panther is running at http://localhost:${PORT}\n`);
});
