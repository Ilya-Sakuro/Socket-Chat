import WebSocket, { WebSocketServer } from 'ws';

function setWsHeartbeat(wss, pong = (ws, data, binary), pingTimeout = 60000) {
    const connections = new Set();
    wss.addListener('connection', ws => {
        connections.add(ws);
        ws.addListener('message', data => {
            connections.add(ws);
            pong(ws, data, typeof data !== 'string');
        });
    });
    const handle = setInterval(() => {
        for (const ws of wss.clients) {
            if (ws.readyState === ws.CONNECTING || ws.readyState === ws.OPEN) {
                if (!connections.has(ws)) {
                    ws.close();
                }
            }
        }
        connections.clear();
    }, pingTimeout);
    wss.addListener('close', () => {
        clearInterval(handle);
    });
}

const wss = new WebSocketServer(
    {
        port: 5000,
    },
    () => console.log(`Server started on port ${wss.address().port}`),
);
setWsHeartbeat(wss, (ws, data, flag) => {
    const ping = JSON.parse(data);
    if (ping.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
    }
});
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
