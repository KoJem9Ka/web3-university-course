import { FC } from 'react';
import { mumbaiAddressUrl } from '../../shared/constants.ts';
import { PosterGatedContractAddress } from '../../contracts';
import { AiFillSecurityScan } from 'react-icons/ai';
import { Link } from '@nextui-org/react';

export const PosterGatedContractLink: FC = () => (
  <Link
    href={mumbaiAddressUrl(PosterGatedContractAddress)}
    target="_blank"
  ><AiFillSecurityScan/>&nbsp;PosterGatedContract</Link>
);
