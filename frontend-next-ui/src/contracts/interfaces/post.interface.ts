import type { Address } from 'abitype';

export interface IPost {
  transactionHash: Address;
  user: Address;
  content: string;
  tag: string;
}
