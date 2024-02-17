import { setWsHeartbeat } from 'ws-heartbeat/server.js';
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer(
    {
        port: 5000,
    },
    () => console.log(`Server started on port ${wss.address().port}`),
);
setWsHeartbeat(
    wss,
    (ws, data, flag) => {
        const ping = JSON.parse(data);
        if (ping.type === 'ping') {
            ws.send('{"type":"pong"}');
        }
    },
    60000,
);
const broadcastMessage = message => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

wss.on('connection', function (ws) {
    ws.on('message', message => {
        try {
            message = JSON.parse(message);
            switch (message.event) {
                case 'message':
                case 'connection':
                    broadcastMessage(message);
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});

wss.on('listening', function listening() {
    console.log('WebSocket server listening');
});
