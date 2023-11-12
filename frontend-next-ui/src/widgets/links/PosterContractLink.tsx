import { FC } from 'react';
import { Link } from '@nextui-org/react';
import { mumbaiAddressUrl } from '../../shared/constants.ts';
import { PosterContractAddress } from '../../contracts';
import { AiFillSecurityScan } from 'react-icons/ai';

export const PosterContractLink: FC = () => (
  <Link
    href={mumbaiAddressUrl(PosterContractAddress)}
    target="_blank"
  ><AiFillSecurityScan/>&nbsp;PosterContract</Link>
);
