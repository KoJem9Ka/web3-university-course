import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { posterContractStore, PosterContractVersionEnum } from '../stores/poster-contract.store.ts';
import { Radio, RadioGroupProps } from 'antd';
import { map } from 'lodash';

interface PosterContractVersionSwitcherProps {
  size?: RadioGroupProps['size'];
}

export const PosterContractVersionSwitcher: FC<PosterContractVersionSwitcherProps> = observer(({ size }) => {
  const { isPostsLoading, version, setVersion } = posterContractStore;

  return (
    <Radio.Group
      disabled={isPostsLoading}
      size={size}
      onChange={e => setVersion(e.target.value)}
      value={version}
      buttonStyle="solid"
    >
      {map(PosterContractVersionEnum, (value, key) => <Radio.Button key={key} value={value}>{key}</Radio.Button>)}
    </Radio.Group>
  );
});