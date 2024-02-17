import { Card } from 'antd';
import { IMessage } from 'components/Chat/ChatContainer';
import { FC } from 'react';

interface MessageProps {
    message: IMessage;
}

export const Message: FC<MessageProps> = ({ message }) => {
    return (
        <div className='mb-8'>
            {message.event === 'connection' ? (
                <div className='font-semibold'>
                    <p className='bg-lime-50 border-solid border border-lime-300 rounded-lg flex justify-center py-2 px-3 text-xs'>
                        User:
                        <span className='uppercase mx-1 border-b border-solid  border-black'>
                            {message.username}
                        </span>
                        connected
                    </p>
                </div>
            ) : (
                <Card
                    classNames={{ title: 'uppercase text-white' }}
                    style={{ backgroundColor: '#5ab0f68a', color: 'white' }}
                    title={message.username}
                    bordered={false}
                    className='w-72'
                >
                    <p>Message: {message.text}</p>
                </Card>
            )}
        </div>
    );
};
