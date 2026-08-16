const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const browsers = new Set();
const arduinos = new Set();

wss.on('connection', (ws, req) => {
  const url = req.url || '';
  const params = new URL('http://localhost' + url).searchParams;
  const role = params.get('role') || params.get('type') || 'browser';
  if (role === 'arduino') {
    arduinos.add(ws);
    console.log('Arduino connected');
  } else {
    browsers.add(ws);
    console.log('Browser connected');
  }

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.ldr !== undefined) {
        const payload = JSON.stringify({ type: 'ldr', value: data.ldr });
        for (const b of browsers) {
          if (b.readyState === WebSocket.OPEN) b.send(payload);
        }
      }
    } catch (e) {
      console.log('Received non-JSON message:', msg.toString());
    }
  });

  ws.on('close', () => {
    arduinos.delete(ws);
    browsers.delete(ws);
  });
});

const PORT = Number(process.env.PORT || 3001);

const startServer = (port) => {
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy; retrying on ${PORT + 1}`);
    startServer(PORT + 1);
    return;
  }
  throw err;
});

startServer(PORT);
