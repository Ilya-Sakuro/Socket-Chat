import { FC } from 'react';
import './App.scss';
import { Chat } from 'components/Chat/Chat.js';

export const App: FC = () => {
    return (
        <div className='App'>
            <Chat />
        </div>
    );
};
