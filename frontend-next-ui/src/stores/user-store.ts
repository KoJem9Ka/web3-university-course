import { makeAutoObservable } from 'mobx';
import type { Address } from 'abitype';
import { getAccount, HelloContract } from '../contracts';
import { toast } from 'sonner';

class UserStore {
  isUserLoading = true;
  account: Address | null = null;
  balance: bigint | null = null;
  isTokenOwner = false;

  constructor() {
    makeAutoObservable(this);
    setInterval(async () => {
      this.balance = this.account ? await HelloContract.read.balanceOf([this.account]) : null;
    }, 7000);
    this.refetchUser();
  }

  public readonly refetchUser = async (requestAccount = false) => {
    this.isUserLoading = true;
    try {
      this.account = await getAccount(requestAccount);
      if (this.account) {
        this.isTokenOwner = await HelloContract.read.owner() === this.account;
        this.balance = await HelloContract.read.balanceOf([this.account]);
      }
    } catch (e) {
      let errorMessage = e instanceof Error ? e.message : e;
      toast.error(`Ошибка загрузки пользователя:\n${errorMessage}`);
      throw new Error(`Ошибка загрузки пользователя: ${errorMessage}`);
    } finally {
      this.isUserLoading = false;
    }
  };

  public readonly authorize = async () => {
    await this.refetchUser(true);
  };
}

export const userStore = new UserStore();
