import { Welcome } from 'components/Welcome/Welcome';
import { FC, useRef, useState } from 'react';
import { Chat } from './Chat';

export interface IMessage {
    id: number;
    event: 'connection' | 'message';
    username: string;
    text?: string;
}

export const ChatContainer: FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const socket = useRef<WebSocket | null>(null);

    const connect = (): void => {
        socket.current = new WebSocket('ws://localhost:5000');
        setInterval(() => {
            if (socket.current?.readyState === WebSocket.OPEN) {
                socket.current.send('{"type":"ping"}');
            }
        }, 30000);
        socket.current.onopen = () => {
            setConnected(true);
            console.log('Chat opened');
            const message: IMessage = {
                event: 'connection',
                username,
                id: Date.now(),
            };

            socket.current?.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event: MessageEvent) => {
            const message: IMessage = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        };
        socket.current.onclose = () => {
            console.log('Chat closed');
            setConnected(false);
        };
        socket.current.onerror = () => {
            console.error('Chat error');
            setConnected(false);
            connect();
        };
    };

    if (!connected) {
        return (
            <Welcome
                connected={connected}
                username={username}
                connect={connect}
                setUsername={setUsername}
                current={socket.current}
            />
        );
    }

    return <Chat messages={messages} username={username} current={socket.current} />;
};
