import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer(
    {
        port: 5000,
    },
    () => console.log(`Server started on port ${wss.address().port}`),
);

const broadcastMessage = message => {
    wss.clients.forEach(client => client.send(JSON.stringify(message)));
};

wss.on('connection', function (ws) {
    ws.on('message', message => {
        message = JSON.parse(message);
        switch (message.event) {
            case 'message':
                broadcastMessage(message);
                break;
            case 'connection':
                broadcastMessage(message);
                break;
        }
    });
});
