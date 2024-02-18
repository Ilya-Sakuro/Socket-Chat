import { AlertError } from 'components/AlertError/AlertError';
import React, { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { setWsHeartbeat } from 'ws-heartbeat/client';

export interface IMessage {
    id: number;
    readonly type?: string;
    event: 'connection' | 'message';
    username: string;
    text?: string;
}
interface SocketContextProps {
    messages: IMessage[];
    username: string;
    setUsername: (username: string) => void;
    socket: WebSocket | null;
    connect: () => void;
    connected: boolean;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const socketRef = useRef<WebSocket | null>(null);

    const connect = (): void => {
        socketRef.current = new WebSocket('ws://localhost:5000');

        setWsHeartbeat(socketRef.current, '{"type":"ping"}', { pingTimeout: 60000, pingInterval: 25000 });

        socketRef.current.onopen = () => {
            setConnected(true);
            console.log('Chat opened');
            const message: IMessage = {
                event: 'connection',
                username,
                id: Date.now(),
            };

            socketRef.current?.send(JSON.stringify(message));
        };

        socketRef.current.onmessage = (event: MessageEvent) => {
            const message: IMessage = JSON.parse(event.data);
            setMessages(prev =>
                [message, ...prev].filter(message => (message.type === 'pong' ? null : message)),
            );
        };

        socketRef.current.onclose = () => {
            console.log('Chat closed');
            setConnected(false);
        };

        socketRef.current.onerror = () => {
            console.error('Chat error');
            setConnected(false);
        };

        setSocket(socketRef.current);
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ messages, username, setUsername, socket, connect, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
