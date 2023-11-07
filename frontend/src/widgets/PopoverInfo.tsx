import { Popover } from 'antd';
import { FC } from 'react';
import { InfoCircleOutlined, InfoCircleTwoTone } from '@ant-design/icons';

interface PopoverHintProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  isError?: boolean;
  className?: string;
}

export const PopoverInfo: FC<PopoverHintProps> = (props) => {
  return (
    <Popover
      title={props.title}
      content={props.content}
      className={props.className}
    >
      {props.isError
        ? <InfoCircleTwoTone twoToneColor="#f00"/>
        : <InfoCircleOutlined/>}
    </Popover>
  );
};
