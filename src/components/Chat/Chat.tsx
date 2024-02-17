import { Space } from 'antd';
import { CustomInput } from 'components/CustomInput/CustomInput';
import { Message } from 'components/Message/Message';

import { FC, useState } from 'react';
import { IMessage } from './ChatContainer';

interface Props {
    messages: IMessage[];
    username: string;
    current: WebSocket | null;
}

export const Chat: FC<Props> = (props: Props) => {
    const { messages, username, current } = props;
    const [value, setValue] = useState('');

    const sendMessage = (): void => {
        const message: IMessage = {
            event: 'message',
            username,
            text: value,
            id: Date.now(),
        };
        current?.send(JSON.stringify(message));
        setValue('');
    };

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
