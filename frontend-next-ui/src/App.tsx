import { observer } from 'mobx-react-lite';
// import HelloTokenPng from '/hello-token.png';
import { SendSection } from './sections/SendSection.tsx';
import { Header } from './widgets/Header.tsx';
import { userStore } from './stores/user-store.ts';
import { ConnectSection } from './sections/ConnectSection.tsx';
import { MintSection } from './sections/MintSection.tsx';
import { Spacer } from '@nextui-org/react';
import { Toaster } from 'sonner';
import { themeStore } from './stores/theme-store.ts';
import { PostsSection } from './sections/posts-section/PostsSection.tsx';
import { ToastModal } from './widgets/modals/ToastModal.tsx';
import { PostCreateModal } from './sections/posts-section/PostCreateModal.tsx';
import { LinksSection } from './sections/LinksSection.tsx';

export const App = observer(() => {
  const { account, isTokenOwner } = userStore;
  const { isDarkTheme } = themeStore;

  return (
    <>
      <Header/>
      {/*<img src={HelloTokenPng} className="h-[70vh] mx-auto"/>*/}
      <LinksSection/>
      <Spacer y={5}/>

      {!account && <ConnectSection/>}

      {account && <SendSection/>}

      {isTokenOwner && <>
        <Spacer y={5}/>
        <MintSection/>
      </>}

      <Spacer y={5}/>
      <PostsSection/>
      <Spacer y={10}/>

      <ToastModal/>
      <PostCreateModal/>
      <Toaster
        richColors
        theme={isDarkTheme ? 'dark' : 'light'}
        position="bottom-right"
        closeButton
      />
    </>
  );
});
