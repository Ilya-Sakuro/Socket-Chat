import { FC } from 'react';
import './App.scss';
import { Chat } from 'components/Chat/Chat.js';
import Title from 'antd/es/typography/Title';

export const App: FC = () => {
    return (
        <div className='app'>
            <Title>Welcome to Socket Chat</Title>
            <Chat />
        </div>
    );
};
