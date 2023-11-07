import { makeAutoObservable } from 'mobx';
import { HelloContract } from '../contracts';
import { Address } from 'abitype';
import { userStore } from './user-store.ts';

class HelloTokenContractStore {
  isHelloContractLoading = true;
  name: string | null = null;
  symbol: string | null = null;
  decimals: number | null = null;
  owner: Address | null = null;

  isTransferModalOpen = false;
  isMintModalOpen = false;

  public readonly transferModalOpen = () => this.isTransferModalOpen = true;
  public readonly transferModalClose = () => this.isTransferModalOpen = false;
  public readonly mintModalOpen = () => this.isMintModalOpen = true;
  public readonly mintModalClose = () => this.isMintModalOpen = false;

  constructor() {
    makeAutoObservable(this);
    this.refetchHelloContract();
  }

  public get isOwner() {
    return this.owner === userStore.account;
  }

  refetchHelloContract = async () => {
    this.isHelloContractLoading = true;
    try {
      [this.owner, this.name, this.symbol, this.decimals] = await Promise.all([
        HelloContract.read.owner(),
        HelloContract.read.name(),
        HelloContract.read.symbol(),
        HelloContract.read.decimals(),
      ]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : e;
      alert(`Ошибка загрузки HelloContract: ${errorMessage}`);
      throw new Error(`Ошибка загрузки HelloContract: ${errorMessage}`);
    } finally {
      this.isHelloContractLoading = false;
    }
  };
}

export const helloTokenContractStore = new HelloTokenContractStore();
