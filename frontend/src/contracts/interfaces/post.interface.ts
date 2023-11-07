import type { Address } from 'abitype';

export interface IPost {
  user?: Address;
  content: string;
  tag: string;
}
