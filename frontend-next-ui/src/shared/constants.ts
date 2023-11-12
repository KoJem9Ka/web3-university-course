import type { Address } from 'abitype';

export const mumbaiTxUrl = (tx: Address) => `https://mumbai.polygonscan.com/tx/${tx}`;

export const mumbaiAddressUrl = (address: Address) => `https://mumbai.polygonscan.com/address/${address}`;
