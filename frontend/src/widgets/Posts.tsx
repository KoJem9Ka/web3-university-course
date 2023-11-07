import { FC } from 'react';
import { Button, Card, Input, Typography } from 'antd';
import { posterContractStore } from '../stores/poster-contract.store.ts';
import * as uuid from 'uuid';
import { observer } from 'mobx-react-lite';
import { isAddress } from 'viem';
import { PosterContractVersionSwitcher } from './PosterContractVersionSwitcher.tsx';
import { ReloadOutlined } from '@ant-design/icons';

export const Posts: FC = observer(() => {
  const {
    isPostsLoading, posts,
    tagSearch, setTagSearch,
    userSearch, setUserSearch,
    fromBlock, setFromBlock,
    postCreateModalOpen,
    refetchPosts,
  } = posterContractStore;

  return (
    <div className="w-[700px] mx-auto">
      <div className="flex items-center">
        <Typography.Title>Посты</Typography.Title>
        <div className="grow"/>
        <Button disabled={isPostsLoading} onClick={refetchPosts}><ReloadOutlined/></Button>
        <div className="w-2"/>
        <PosterContractVersionSwitcher/>
        <div className="w-2"/>
        <Button disabled={isPostsLoading} onClick={postCreateModalOpen} type="primary">Создать пост</Button>
      </div>
      <div className="flex gap-3 justify-between mb-7">
        <Input value={tagSearch} onChange={e => setTagSearch(e.currentTarget.value)} placeholder="Поиск по тэгу"/>
        <Input
          value={userSearch}
          status={userSearch && !isAddress(userSearch) ? 'error' : undefined}
          onChange={e => setUserSearch(e.currentTarget.value)}
          placeholder="Поиск по аккаунту"
        />
        <Input value={fromBlock} onChange={e => setFromBlock(e.currentTarget.value)} placeholder="Поиск с блока"/>
      </div>
      {isPostsLoading
        ? (<Typography.Text>Загрузка...</Typography.Text>)
        : posts.length
          ? posts.map((post) => (
            <Card key={uuid.v4()} className="mb-2" title={`От ${post.user}`}>
              {post.content.split('\n').map((line, i) => (<>
                {i !== 0 && <div className="h-2"/>}
                <Typography.Paragraph className="!m-0" key={i}>{line}</Typography.Paragraph>
              </>))}
            </Card>
          ))
          : (
            <Typography.Text>Постов нет</Typography.Text>
          )}
    </div>
  );
});