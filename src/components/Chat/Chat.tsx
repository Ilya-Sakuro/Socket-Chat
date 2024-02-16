import { Alert, Button, Card, Input, Space, Spin } from 'antd';
import { ChangeEvent, FC, useRef, useState } from 'react';
import styles from './chat.module.scss';

interface Message {
    id: number;
    event: 'connection' | 'message';
    username: string;
    text?: string;
}

export const Chat: FC = (): JSX.Element => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [value, setValue] = useState<string>('');
    const [connected, setConnected] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
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
            const message: Message = {
                event: 'connection',
                username,
                id: Date.now(),
            };

            socket.current?.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event: MessageEvent) => {
            const message: Message = JSON.parse(event.data);
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
    const sendMessage = (): void => {
        const message: Message = {
            event: 'message',
            username,
            text: value,
            id: Date.now(),
        };
        socket.current?.send(JSON.stringify(message));
        setValue('');
    };
    if (!connected) {
        return (
            <div className={styles.centerConnect}>
                <Space.Compact className={styles.form}>
                    {connected === false && socket.current !== null && (
                        <div>
                            <Alert message='Connection lost. Trying to reconnect...' type='error' />
                        </div>
                    )}
                </Space.Compact>
                <Space.Compact className={styles.form}>
                    <Input
                        className={styles.input}
                        placeholder='Enter your name'
                        type='text'
                        value={username}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        onPressEnter={username.length > 0 ? connect : undefined}
                    />
                    <Button
                        className={styles.btn}
                        type='primary'
                        onClick={connect}
                        disabled={username.length <= 0}
                    >
                        Enter the chat
                    </Button>
                </Space.Compact>
            </div>
        );
    }

    return (
        <div className={styles.center}>
            <div className={styles.centerChat}>
                <Space.Compact className={styles.chat}>
                    {messages.map((message: Message) => (
                        <div key={message.id} className='message'>
                            {message.event === 'connection' ? (
                                <div>
                                    <Alert message={`User: ${message.username} connected`} type='success' />
                                </div>
                            ) : (
                                <Card title={message.username} bordered={false} className={styles.card}>
                                    <p>Message: {message.text}</p>
                                </Card>
                            )}
                        </div>
                    ))}
                </Space.Compact>
            </div>
            <Space.Compact className={styles.form}>
                <Input
                    className={styles.input}
                    placeholder='Type message'
                    type='text'
                    value={value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    onPressEnter={value.length > 0 ? sendMessage : undefined}
                />

                <Button
                    className={styles.btn}
                    type='primary'
                    onClick={sendMessage}
                    disabled={value.length <= 0}
                >
                    Send message
                </Button>
            </Space.Compact>
        </div>
    );
};
