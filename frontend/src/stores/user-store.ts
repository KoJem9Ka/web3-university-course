import { makeAutoObservable } from 'mobx';
import type { Address } from 'abitype';
import { getAccount, HelloContract } from '../contracts';

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

  refetchUser = async (requestAccount = false) => {
    this.isUserLoading = true;
    try {
      this.account = await getAccount(requestAccount);
      if (this.account) {
        this.isTokenOwner = await HelloContract.read.owner() === this.account;
        this.balance = await HelloContract.read.balanceOf([this.account]);
      }
    } catch (e) {
      let errorMessage = e instanceof Error ? e.message : e;
      alert(`Ошибка загрузки пользователя: ${errorMessage}`);
      throw new Error(`Ошибка загрузки пользователя: ${errorMessage}`);
    } finally {
      this.isUserLoading = false;
    }
  };

  authorize = async () => {
    await this.refetchUser(true);
  };

  get accountShort() {
    return this.account ? `${this.account.slice(0, 6)}...${this.account.slice(-4)}` : null;
  }
}

export const userStore = new UserStore();
