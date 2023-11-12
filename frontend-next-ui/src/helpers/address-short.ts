import type { Address } from 'abitype';

export const addressShort = (address: Address): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
