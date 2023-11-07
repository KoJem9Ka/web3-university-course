import { createPublicClient, createWalletClient, custom, http } from 'viem';
import type { Address } from 'abitype';
import { polygonMumbai } from 'viem/chains';

export const publicClient = createPublicClient({
  transport: http(),
  chain: polygonMumbai,
});

export const walletClient = createWalletClient({
  transport: window.ethereum ? custom(window.ethereum) : http(),
  chain: polygonMumbai,
});

export const getAccount = async <Force extends boolean>(force?: Force): Promise<Address | (Force extends true ? never : null)> => {
  if (force) {
    await walletClient.requestAddresses();
  }
  const [address] = await walletClient.getAddresses();
  if (force && !address) {
    alert('Нет доступа к аккаунту');
    throw new Error('Нет доступа к аккаунту');
  }
  return address || null;
};

export const displayTokenInWallet = async (options: {
  address: string,
  symbol: string,
  decimals: number,
  image?: string,
}): Promise<void> => {
  if (!window.ethereum) {
    alert('MetaMask is not installed');
    throw new Error('MetaMask is not installed');
  }
  const isAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: options.address, // The address of the token.
        symbol: options.symbol, // A ticker symbol or shorthand, up to 5 characters.
        decimals: options.decimals, // The number of decimals in the token.
        image: options.image, // A string URL of the token logo.
      },
    },
  });
  alert(isAdded ? 'Токен добавлен в кошелек!' : 'Токен не был добавлен в кошелек :(');
};
