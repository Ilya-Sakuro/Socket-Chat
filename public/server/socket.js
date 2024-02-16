import WebSocket, { WebSocketServer } from 'ws';

function heartbeat() {
    this.isAlive = true;
}

const wss = new WebSocketServer(
    {
        port: 5000,
    },
    () => console.log(`Server started on port ${wss.address().port}`),
);

const broadcastMessage = message => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

wss.on('connection', function (ws) {
    ws.isAlive = true;

    ws.on('message', message => {
        try {
            message = JSON.parse(message);
            switch (message.event) {
                case 'message':
                    broadcastMessage(message);
                    break;
                case 'connection':
                    broadcastMessage(message);
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    ws.on('pong', heartbeat);
    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});
const interval = setInterval(function ping() {
    wss.clients?.forEach(function each(ws) {
        if (ws.isAlive === false) {
            console.log('Client disconnected');
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 3000);

wss.on('close', function close() {
    clearInterval(interval);
});
wss.on('listening', function listening() {
    console.log('WebSocket server listening');
});
