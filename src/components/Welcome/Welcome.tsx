import Title from 'antd/es/typography/Title';
import { CustomInput } from 'components/CustomInput/CustomInput';
import { useSocket } from 'contexts/SocketContext';
import { FC } from 'react';

export const Welcome: FC = () => {
    const { username, setUsername, socket, connect, connected } = useSocket();
    return (
        <div className='flex flex-col justify-center w-1/2'>
            {!connected && <Title className='!text-slate-100 text-center'>Welcome to Socket Chat</Title>}
            <CustomInput value={username} onClick={connect} setEvent={setUsername} />
        </div>
    );
};
