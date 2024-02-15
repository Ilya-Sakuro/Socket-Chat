import { ChangeEvent, FC, useRef, useState } from 'react';

interface Message {
    id: number;
    event: 'connection' | 'message';
    username: string;
    text?: string;
}

export const Chat: FC = (): JSX.Element => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [value, setValue] = useState<string>('');
    const socket = useRef<WebSocket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    const connect = (): void => {
        socket.current = new WebSocket('ws://localhost:5000');
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
        socket.current.onmessage = event => {
            const message: Message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        };
        socket.current.onclose = () => {
            console.log('Chat closed');
        };
        socket.current.onerror = () => {
            console.log('Chat error');
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
            <div className='center'>
                <div className='form'>
                    <input
                        type='text'
                        placeholder='Enter your name'
                        value={username}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    />
                    <button onClick={connect}>Enter the chat</button>
                </div>
            </div>
        );
    }

    return (
        <div className='center'>
            <div className='form'>
                <input
                    type='text'
                    value={value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                />
                <button onClick={sendMessage}>Send message</button>
            </div>
            <div className='messages'>
                {messages.map((message: Message) => (
                    <div key={message.id} className='message'>
                        {message.event === 'connection' ? (
                            <div>User: {message.username} connected</div>
                        ) : (
                            <div>
                                {message.username}: {message.text}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
