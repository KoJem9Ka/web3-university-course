import { FC } from 'react';
import { Header } from './widgets/Header.tsx';
import { Posts } from './widgets/Posts.tsx';
import { PostCreateModal } from './widgets/modals/PostCreateModal.tsx';
import { TransferModal } from './widgets/modals/TransferModal.tsx';
import { MintModal } from './widgets/modals/MintModal.tsx';

export const App: FC = () => (
  <>
    <Header/>
    <Posts/>
    <PostCreateModal/>
    <TransferModal/>
    <MintModal/>
  </>
);
