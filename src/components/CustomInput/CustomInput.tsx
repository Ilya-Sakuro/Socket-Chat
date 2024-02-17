import { Button, Input, Space } from 'antd';
import { ChangeEvent, FC } from 'react';

type CustomInputProps = {
    value: string;
    onClick: () => void;
    setEvent: (value: string) => void;
};

export const CustomInput: FC<CustomInputProps> = ({ value, onClick, setEvent }) => {
    return (
        <Space.Compact className='flex justify-center mt-7'>
            <Input
                className='w-1/3'
                placeholder='Enter your name'
                type='text'
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEvent(e.target.value)}
                onPressEnter={value.length > 0 ? onClick : undefined}
            />
            <Button
                className='bg-blue-500  disabled:bg-stone-400 disabled:text-white'
                type='primary'
                onClick={onClick}
                disabled={value.length <= 0}
            >
                Enter the chat
            </Button>
        </Space.Compact>
    );
};
