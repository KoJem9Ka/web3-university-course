import { createPublicClient, createWalletClient, custom, http, UserRejectedRequestError } from 'viem';
import type { Address } from 'abitype';
import { polygonMumbai } from 'viem/chains';
import { toast } from 'sonner';

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
    await walletClient.requestAddresses().catch((error) => {
      if (error instanceof UserRejectedRequestError) {
        toast.error(`Нет доступа к аккаунту`);
        throw error;
      }
    });
  }
  const [address] = await walletClient.getAddresses();
  return address || null;
};

export const displayTokenInWallet = async (options: {
  address: string,
  symbol: string,
  decimals: number,
  image?: string,
}): Promise<void> => {
  if (!window.ethereum) {
    toast.error('MetaMask is not installed');
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
  if (isAdded) {
    toast.success('Токен добавлен в кошелек!');
  } else {
    toast.error('Токен не был добавлен в кошелек :(');
  }
};
