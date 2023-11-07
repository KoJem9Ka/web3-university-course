import { makeAutoObservable } from 'mobx';
import { getAccount, IPost, PosterContract, PosterGatedContract, publicClient } from '../contracts';
import { compact, flatten, isEmpty, min, sortBy, sortedUniq, sortedUniqBy } from 'lodash';
import { Address } from 'abitype';
import { isAddress } from 'viem';
import { tokenLinkedToPosterStore } from './token-linked-to-poster.store.ts';

export enum PosterContractVersionEnum {
  Free = 'Free',
  Gated = 'Gated',
}

const maxBlocks = 1000n;

class PosterContractStore {
  version: PosterContractVersionEnum = PosterContractVersionEnum.Gated;

  isPostsLoading = true;
  posts: IPost[] = [];

  isPostCreateModalOpen = false;

  tagSearch: string = '';
  userSearch: Address = '' as Address;
  fromBlock: string = '';

  private refetchTimeout: ReturnType<typeof setTimeout> | undefined;

  public readonly postCreateModalOpen = () => {
    this.isPostCreateModalOpen = true;
  };

  public readonly postCreateModalClose = () => {
    this.isPostCreateModalOpen = false;
  };

  public readonly setTagSearch = (tagSearch: string) => {
    this.tagSearch = tagSearch;
    this.delayedRefetchPosts();
  };

  public readonly setUserSearch = (userSearch: Address | string) => {
    this.userSearch = userSearch as Address;
    this.delayedRefetchPosts();
  };

  public readonly setFromBlock = (fromBlock: string) => {
    try {
      const value = BigInt(fromBlock);
      if (value < 0n) throw new Error();
      this.fromBlock = fromBlock;
      this.delayedRefetchPosts();
    } catch (e) {
      // ignore
    }
  };

  public readonly setVersion = (version: PosterContractVersionEnum) => {
    this.version = version;
    this.refetchPosts();
  };

  constructor() {
    makeAutoObservable(this);
    this.refetchPosts();
    publicClient.getBlockNumber().then(currentBlock => this.fromBlock = (currentBlock - maxBlocks).toString());
  }

  private delayedRefetchPosts() {
    clearTimeout(this.refetchTimeout);
    this.refetchTimeout = setTimeout(this.refetchPosts, 500);
  }

  private get contract() {
    return this.version === PosterContractVersionEnum.Free ? PosterContract : PosterGatedContract;
  }

  public readonly refetchPosts = async () => {
    try {
      this.isPostsLoading = true;
      const currentBlock = await publicClient.getBlockNumber();
      const fromBlocks = sortedUniq(sortBy(compact([
        41943231n, 41960700n, 42046541n, 42092483n,
        BigInt(this.fromBlock), currentBlock - maxBlocks,
      ])));
      const events = await Promise.all(fromBlocks.map(async _fromBlock => {
        const toBlock = min([_fromBlock + maxBlocks, currentBlock]);
        return this.contract.getEvents.NewPost({
            tag: !isEmpty(this.tagSearch) ? this.tagSearch : undefined,
            user: isAddress(this.userSearch) ? this.userSearch : undefined,
          }, { fromBlock: _fromBlock, toBlock },
        );
      })).then(flatten).then(_events => sortedUniqBy(sortBy(_events, e => e.blockNumber), e => e.blockNumber).reverse());
      this.posts = events.map(e => e.args as IPost);
    } catch (e) {
      const errorMessage = `Ошибка загрузки постов: ${e instanceof Error ? e.message : e}`;
      alert(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.isPostsLoading = false;
    }
  };

  public readonly createPost = async (args: { content: string, tag: string }) => {
    try {
      this.isPostsLoading = true;
      if (isEmpty(args.content) || isEmpty(args.tag)) {
        alert('Тег и содержимое не должны быть пустыми');
        throw new Error('Тег и содержимое не должны быть пустыми');
      }
      if (this.version === PosterContractVersionEnum.Gated) {
        await tokenLinkedToPosterStore.refetchTokenLinkedToPoster(true);
        const { missingTokensReadable } = tokenLinkedToPosterStore;
        if (missingTokensReadable) {
          alert(`Недостаточно ${missingTokensReadable} для создания поста`);
          throw new Error(`Недостаточно ${missingTokensReadable} для создания поста`);
        }
      }
      await (this.contract as typeof PosterContract).write.post(
        [args.content, args.tag],
        { account: await getAccount(true) },
      );
      alert('Пост создан!');
    } catch (e) {
      const errorMessage = `Ошибка создания поста: ${e instanceof Error ? e.message : e}`;
      alert(errorMessage);
      throw new Error(errorMessage);
    } finally {
      await this.refetchPosts();
      this.isPostsLoading = false;
    }
  };
}

export const posterContractStore = new PosterContractStore();
