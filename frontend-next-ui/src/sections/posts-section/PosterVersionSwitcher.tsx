import { observer } from 'mobx-react-lite';
import { Button, ButtonGroup, ButtonGroupProps, Tooltip } from '@nextui-org/react';
import { FC, MouseEventHandler } from 'react';
import { posterContractStore, PosterContractVersionEnum } from '../../stores/poster-contract.store.tsx';
import { map } from 'lodash';
import { tokenLinkedToPosterStore } from '../../stores/token-linked-to-poster.store.ts';
import { PosterContractLink } from '../../widgets/links/PosterContractLink.tsx';
import { PosterGatedContractLink } from '../../widgets/links/PosterGatedContractLink.tsx';
import { TokenLinkedToPosterContractLink } from '../../widgets/links/TokenLinkedToPosterContractLink.tsx';

interface PosterVersionSwitcherProps {
  size?: ButtonGroupProps['size'];
}

export const PosterVersionSwitcher: FC<PosterVersionSwitcherProps> = observer((props) => {
  const { isPostsLoading, version, setVersion } = posterContractStore;
  const { thresholdReadable } = tokenLinkedToPosterStore;

  const onVersionChange: MouseEventHandler<HTMLButtonElement> = (e) => {
    const newVersion = e.currentTarget.name as PosterContractVersionEnum;
    setVersion(newVersion);
  };

  const tooltipContent = {
    [PosterContractVersionEnum.Free]: <>
      <p>Все пользователи могут создавать посты 📢</p>
      <p>Для этого используется контракт:{' '}<PosterContractLink/></p>
    </>,
    [PosterContractVersionEnum.Gated]: <>
      <p>Для создания постов необходимо пороговое значение токенов на балансе</p>
      <p>В данный момент установлен порог в {thresholdReadable}</p>
      <p>Для этого используется контракт:{' '}<PosterGatedContractLink/></p>
      <p className="flex items-center gap-2">И привязанный к нему токен:{' '}<TokenLinkedToPosterContractLink/></p>
    </>,
  };

  return (
    <ButtonGroup size={props.size}>
      {map(PosterContractVersionEnum, (value, key) => (
        <Tooltip key={key} content={tooltipContent[value]}>
          <Button
            disabled={isPostsLoading}
            onClick={version === value ? undefined : onVersionChange}
            name={value}
            variant={version === value ? 'solid' : 'flat'}
            color={version === value ? 'primary' : undefined}
          >{value}</Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
});
