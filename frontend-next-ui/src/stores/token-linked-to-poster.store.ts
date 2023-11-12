import { erc20Abi } from 'abitype/abis';
import { getAccount, PosterGatedContract, publicClient, walletClient } from '../contracts';
import { getContract } from 'viem';
import { isNil } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { toNormal } from '../helpers';
import { Address } from 'abitype';

class TokenLinkedToPosterStore {
  isTokenLinkedToPosterLoading = true;

  TokenContractLinkedToPosterAddress: Address | null = null;
  name: string | null = null;
  balance: bigint | null = null;
  symbol: string | null = null;
  decimals: number | null = null;
  threshold: bigint | null = null;

  constructor() {
    makeAutoObservable(this);
    this.refetchTokenLinkedToPoster();
  }

  get balanceReadable(): string | null {
    return isNil(this.balance) || isNil(this.decimals)
      ? null
      : `${toNormal(this.balance, this.decimals)} ${this.symbol}`;
  }

  get thresholdReadable(): string | null {
    return isNil(this.threshold) || isNil(this.decimals)
      ? null
      : `${toNormal(this.threshold, this.decimals)} ${this.symbol}`;
  }

  get missingTokensReadable(): string | null {
    return isNil(this.balance) || isNil(this.threshold) || isNil(this.decimals)
      ? '(Не удалось проверить баланс)'
      : this.threshold - this.balance > 0n
        ? `${toNormal(this.threshold - this.balance, this.decimals)} ${this.symbol}`
        : null;
  }

  public readonly refetchTokenLinkedToPoster = async (requestAccount = false) => {
    try {
      const account = await getAccount(requestAccount);
      this.isTokenLinkedToPosterLoading = true;
      this.TokenContractLinkedToPosterAddress = await PosterGatedContract.read.tokenAddress();
      const tokenContract = getContract({
        abi: erc20Abi,
        address: this.TokenContractLinkedToPosterAddress,
        publicClient: publicClient,
        walletClient: walletClient,
      });
      [this.balance, this.name, this.symbol, this.decimals, this.threshold] = await Promise.all([
        account ? tokenContract.read.balanceOf([account]) : null,
        tokenContract.read.name(),
        tokenContract.read.symbol(),
        tokenContract.read.decimals(),
        PosterGatedContract.read.threshold(),
      ]);
    } catch (e) {
      const errorMessage = `Ошибка загрузки связанного токена: ${e instanceof Error ? e.message : e}`;
      alert(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.isTokenLinkedToPosterLoading = false;
    }
  };
}

export const tokenLinkedToPosterStore = new TokenLinkedToPosterStore();
