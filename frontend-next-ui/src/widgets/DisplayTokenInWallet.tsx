import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Tooltip } from '@nextui-org/react';
import { BiShowAlt } from 'react-icons/bi';
import { helloTokenContractStore } from '../stores/hello-token-contract.store.ts';
import { displayTokenInWallet, HelloContractAddress } from '../contracts';
import HelloTokenSvg from '/hello-token.svg';

export const DisplayTokenInWallet: FC = observer(() => {
  const { isHelloContractLoading, symbol, decimals } = helloTokenContractStore;

  const onClick = async () => {
    if (!symbol || !decimals) return;
    await displayTokenInWallet({
      address: HelloContractAddress,
      symbol,
      decimals,
      image: `${window.location.origin}${HelloTokenSvg}`,
    });
  };

  return (
    <Tooltip content={`Показать ${symbol} в кошельке`}>
      <Button
        disabled={!symbol || !decimals}
        isLoading={isHelloContractLoading}
        onClick={onClick}
        isIconOnly
        radius="full"
        variant="light"
      >
        <BiShowAlt/>
      </Button>
    </Tooltip>
  );
});