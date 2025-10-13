// websocket.mjs
import { WebSocketServer } from 'ws';
import http from 'http';

let wss = null; // this will store the WebSocket server instance

// ✅ Initialize WebSocket Server
export function initWebSocket(app, port) {
  const server = http.createServer(app);
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔌 Client connected via WebSocket');
    ws.send('✅ Connection established via WebSocket');
  });

  server.listen(port, () => {
    console.log(`🚀 HTTP & WebSocket server running at http://localhost:${port}`);
  });

  return server; // return so Express does not try to call app.listen again
}

// ✅ Function to send/broadcast messages
export function sendWebSocketMessage(message) {
  if (!wss) {
    console.warn('⚠ WebSocket server not initialized yet.');
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}
