import { FC } from 'react';
import { userStore } from '../stores/user-store.ts';
import { observer } from 'mobx-react-lite';
import { helloTokenContractStore } from '../stores/hello-token-contract.store.ts';
import { Button, Dropdown, Typography } from 'antd';
import { clickUrl, Falsy, toNormal } from '../helpers';
import { EyeTwoTone, GithubOutlined, LinkOutlined, PlusCircleTwoTone, SecurityScanTwoTone, SendOutlined } from '@ant-design/icons';
import { displayTokenInWallet, HelloContractAddress, PosterContractAddress, PosterGatedContractAddress } from '../contracts';
import { tokenLinkedToPosterStore } from '../stores/token-linked-to-poster.store.ts';
import HelloTokenSvg from '/hello-token.svg';
import { compact } from 'lodash';
import type { ItemType } from 'antd/es/menu/hooks/useItems';

export const Header: FC = observer(() => {
  const { isUserLoading, accountShort, balance, account } = userStore;
  const { isHelloContractLoading, symbol, name, decimals, isOwner, transferModalOpen, mintModalOpen } = helloTokenContractStore;
  const { TokenContractLinkedToPosterAddress } = tokenLinkedToPosterStore;

  return (
    <div className="bg-gray-200 p-3 flex items-center">
      {!accountShort
        ? <Button disabled={isUserLoading} onClick={userStore.authorize}>Подключить MetaMask</Button>
        : isUserLoading || isHelloContractLoading
          ? <Typography.Text type="secondary">Загрузка...</Typography.Text>
          : <Dropdown menu={{
            items: compact([{
              key: 'polygonscan',
              icon: <SecurityScanTwoTone twoToneColor="violet"/>,
              label: 'PolygonScan',
              onClick: () => clickUrl(`https://mumbai.polygonscan.com/address/${account}`),
            }, {
              key: 'transfer',
              icon: <SendOutlined className="text-green-500"/>,
              label: `Перевести`,
              onClick: transferModalOpen,
            }, !isHelloContractLoading && account && isOwner && {
              key: 'mint',
              icon: <PlusCircleTwoTone twoToneColor={'orange'}/>,
              label: `Создать`,
              onClick: mintModalOpen,
            }, {
              key: 'add-token-to-wallet',
              icon: <EyeTwoTone/>,
              label: `Показать в кошельке`,
              onClick: () => symbol && decimals && displayTokenInWallet({
                address: HelloContractAddress,
                symbol,
                decimals,
                image: `${window.location.origin}${HelloTokenSvg}`,
              }),
            }] satisfies Falsy<ItemType | boolean>[]),
          }}>
            <Typography.Link>
              <div className="flex items-center">
                {accountShort}:
                &nbsp;
                <img src={HelloTokenSvg} className="w-5" alt={`${name} token image`}/>
                &nbsp;
                {toNormal(balance, decimals)}
                &nbsp;
                {symbol}
              </div>
            </Typography.Link>
          </Dropdown>}
      <div className="grow"/>
      <Dropdown menu={{
        items: [{
          key: 'github',
          icon: <GithubOutlined/>,
          label: 'GitHub',
          onClick: () => clickUrl('https://github.com/KoJem9Ka/web3-university-course'),
        }, {
          key: 'poster-contract',
          icon: <SecurityScanTwoTone twoToneColor="violet"/>,
          label: '1. PosterContract',
          onClick: () => clickUrl(`https://mumbai.polygonscan.com/address/${PosterContractAddress}`),
        }, {
          key: 'hello-token-contract',
          icon: <SecurityScanTwoTone twoToneColor="violet"/>,
          label: '2. HelloTokenContract',
          onClick: () => clickUrl(`https://mumbai.polygonscan.com/address/${HelloContractAddress}`),
        }, {
          key: 'poster-gated-contract',
          icon: <SecurityScanTwoTone twoToneColor="violet"/>,
          label: '3.1. PosterGatedContract',
          onClick: () => clickUrl(`https://mumbai.polygonscan.com/address/${PosterGatedContractAddress}`),
        }, {
          key: 'token-contract-linked-to-poster',
          icon: <SecurityScanTwoTone twoToneColor="violet"/>,
          label: '3.2. TokenContractLinkedToPoster',
          onClick: () => clickUrl(`https://mumbai.polygonscan.com/address/${TokenContractLinkedToPosterAddress}`),
        }],
      }}>
        <Button icon={<LinkOutlined/>} type="link">Links</Button>
      </Dropdown>
    </div>
  );
});
