import Title from 'antd/es/typography/Title';
import { AlertError } from 'components/AlertError/AlertError';
import { CustomInput } from 'components/CustomInput/CustomInput';
import { FC } from 'react';

interface WelcomeProps {
    connected: boolean;
    username: string;
    connect: () => void;
    setUsername: (username: string) => void;
    current: WebSocket | null;
}

export const Welcome: FC<WelcomeProps> = ({ connected, username, connect, setUsername, current }) => {
    return (
        <div className='flex flex-col justify-center w-1/2'>
            {!connected && <Title className='!text-slate-100 text-center'>Welcome to Socket Chat</Title>}
            <CustomInput value={username} onClick={connect} setEvent={setUsername} />
            {!connected && current !== null && <AlertError />}
        </div>
    );
};
