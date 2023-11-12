import { observer } from 'mobx-react-lite';
import { posterContractStore } from '../../stores/poster-contract.store.tsx';
import { Button, Card, CardBody, CardHeader, Input, Link, Skeleton, Spacer } from '@nextui-org/react';
import { PosterVersionSwitcher } from './PosterVersionSwitcher.tsx';
import { random, range } from 'lodash';
import { mumbaiTxUrl } from '../../shared/constants.ts';
import * as uuid from 'uuid';

export const PostsSection = observer(() => {
  const {
    isPostsLoading, posts,
    refetchPosts, postCreateModalOpen,
    tagSearch, setTagSearch,
    userSearch, setUserSearch,
    fromBlock, setFromBlock,
  } = posterContractStore;

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="flex justify-between items-center gap-3">
        <h2 className="text-center text-3xl">Посты</h2>
        <Spacer className="grow"/>
        <Button disabled={isPostsLoading} onClick={refetchPosts} isIconOnly radius="full">↻</Button>
        <Button onClick={postCreateModalOpen} color="primary">Создать</Button>
        <PosterVersionSwitcher/>
      </div>
      <div className="flex gap-3 my-3">
        <Input readOnly={isPostsLoading} size="sm" value={tagSearch} onChange={e => setTagSearch(e.currentTarget.value)} label="Тэг"/>
        <Input readOnly={isPostsLoading} size="sm" value={userSearch} onChange={e => setUserSearch(e.currentTarget.value)} label="Аккаунт"/>
        <Input readOnly={isPostsLoading} size="sm" value={fromBlock} onChange={e => setFromBlock(e.currentTarget.value)} label="С блока"/>
      </div>
      {isPostsLoading ? range(5).map(() => (
        <Card className="mt-5" key={uuid.v4()}>
          <CardHeader><Skeleton className="rounded-full w-3/5 h-3"/></CardHeader>
          <CardBody className="gap-3">
            {range(random(2, 7)).map(() => {
              return <Skeleton key={uuid.v4()} className={`rounded-full h-3`} style={{ width: `${random(20, 90)}%` }}/>;
            })}
          </CardBody>
        </Card>
      )) : (posts.map(post => (
        <Card className="mt-5" key={post.transactionHash}>
          <CardHeader className="justify-between">
            <h3 className="font-semibold">От {post.user}</h3>
            <Link showAnchorIcon target="_blank" href={mumbaiTxUrl(post.transactionHash)}>Транзакция</Link>
          </CardHeader>
          <CardBody className="gap-3">
            {post.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
          </CardBody>
        </Card>
      )))}
    </div>
  );
});
