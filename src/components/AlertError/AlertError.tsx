import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Space } from 'antd';
import { FC } from 'react';

export const AlertError: FC = () => {
    return (
        <Space.Compact className='flex justify-center'>
            <Alert
                message='OOPS Sorry! Connection lost. Try refreshing the page...'
                showIcon={true}
                icon={<LoadingOutlined className='!text-red-400' />}
                type='error'
            />
        </Space.Compact>
    );
};
