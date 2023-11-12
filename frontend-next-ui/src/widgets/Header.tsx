import { FC } from 'react';
import { ConnectedAccount } from './ConnectedAccount.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { DisplayTokenInWallet } from './DisplayTokenInWallet.tsx';
import { Spacer } from '@nextui-org/react';

export const Header: FC = () => {
  return (
    <div className="sticky top-0 z-50 bg-background backdrop-blur bg-opacity-50 max-w-[900px] mx-auto py-5 px-3 flex gap-3 justify-between">
      <ConnectedAccount/>
      <Spacer className="grow"/>
      <DisplayTokenInWallet/>
      <ThemeToggle/>
    </div>
  );
};
