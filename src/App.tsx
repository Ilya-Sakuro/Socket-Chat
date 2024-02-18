import { FC } from 'react';
import './App.scss';

import { SocketProvider } from 'contexts/SocketContext';
import { Chat } from 'components/Chat/Chat';

export const App: FC = () => {
    return (
        <SocketProvider>
            <div className='flex flex-col justify-evenly items-center min-h-screen p-5'>
                <Chat />
            </div>
        </SocketProvider>
    );
};
