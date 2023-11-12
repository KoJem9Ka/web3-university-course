import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Skeleton, User } from '@nextui-org/react';
import HelloTokenSvg from '/hello-token.svg';
import { userStore } from '../stores/user-store.ts';
import { helloTokenContractStore } from '../stores/hello-token-contract.store.ts';
import { toNormal } from '../helpers';
import { addressShort } from '../helpers/address-short.ts';

export const ConnectedAccount: FC = observer(() => {
  const { isUserLoading, account, balance, authorize } = userStore;
  const { isHelloContractLoading, decimals, symbol } = helloTokenContractStore;
  const isLoading = isUserLoading || isHelloContractLoading;

  return (
    <>
      {isLoading ? (
          <div className="max-w-[150px] w-full flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-10 h-10"/>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-full rounded-lg"/>
              <Skeleton className="h-3 w-3/5 rounded-lg"/>
            </div>
          </div>
        )
        : (
          <User
            onClick={!account ? authorize : undefined}
            as={!account ? 'button' : undefined}
            className={!account ? 'cursor-pointer' : undefined}
            isFocusable={!account}
            name={account ? addressShort(account) : 'Подключите MetaMask'}
            description={account ? `${toNormal(balance, decimals)} ${symbol}` : 'Нажмите, чтобы подключить'}
            avatarProps={{ isBordered: true, src: HelloTokenSvg }}
          />
        )}
    </>
  );
});
