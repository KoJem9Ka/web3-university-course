import { getContract } from 'viem';
import { HelloContractAbi, PosterContractAbi, PosterGatedContractAbi } from './abies';
import { HelloContractAddress, PosterContractAddress, PosterGatedContractAddress } from './addreses.ts';
import { publicClient, walletClient } from './viem.ts';

export const PosterContract = getContract({
  abi: PosterContractAbi,
  address: PosterContractAddress,
  publicClient,
  walletClient,
});

export const HelloContract = getContract({
  abi: HelloContractAbi,
  address: HelloContractAddress,
  publicClient,
  walletClient,
});

export const PosterGatedContract = getContract({
  abi: PosterGatedContractAbi,
  address: PosterGatedContractAddress,
  publicClient,
  walletClient,
});
