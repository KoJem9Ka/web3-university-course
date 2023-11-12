import { FC } from 'react';
import { Link } from '@nextui-org/react';
import { mumbaiAddressUrl } from '../../shared/constants.ts';
import { HelloContractAddress } from '../../contracts';
import { AiFillSecurityScan } from 'react-icons/ai';

export const HelloTokenContractLink: FC = () => (
  <Link
    href={mumbaiAddressUrl(HelloContractAddress)}
    target="_blank"
  ><AiFillSecurityScan/>&nbsp;HelloTokenContract</Link>
);
