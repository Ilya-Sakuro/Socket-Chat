import { Result, Space } from 'antd';
import { AlertError } from 'components/AlertError/AlertError';
import { CustomInput } from 'components/CustomInput/CustomInput';
import { Message } from 'components/Message/Message';
import { Welcome } from 'components/Welcome/Welcome';
import { IMessage, useSocket } from 'contexts/SocketContext';

import { FC, useState } from 'react';

export const Chat: FC = () => {
    const { connected, messages, username, socket } = useSocket();
    const [value, setValue] = useState('');

    const sendMessage = (): void => {
        const message: IMessage = {
            event: 'message',
            username,
            text: value,
            id: Date.now(),
        };
        socket?.send(JSON.stringify(message));
        setValue('');
    };

    const contentChat = () => {
        if (!connected && socket === null) {
            return <Welcome />;
        }
        if (!connected && socket !== null) {
            return <AlertError />;
        }
        return (
            <div className='flex flex-col justify-between w-full'>
                <Space.Compact className='flex flex-col-reverse items-center'>
                    {messages.map(message => (
                        <Message key={message.id} message={message} />
                    ))}
                </Space.Compact>

                <CustomInput value={value} onClick={sendMessage} setEvent={setValue} />
            </div>
        );
    };
    return contentChat();
};
