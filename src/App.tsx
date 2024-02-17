import { FC } from 'react';
import './App.scss';

import { ChatContainer } from 'components/Chat/ChatContainer';

export const App: FC = () => {
    return (
        <div className='flex flex-col justify-evenly items-center min-h-screen p-5'>
            <ChatContainer />
        </div>
    );
};
