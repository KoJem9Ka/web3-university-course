import { FC } from 'react';
import { mumbaiAddressUrl } from '../../shared/constants.ts';
import { AiFillSecurityScan } from 'react-icons/ai';
import { Link, Skeleton } from '@nextui-org/react';
import { tokenLinkedToPosterStore } from '../../stores/token-linked-to-poster.store.ts';

export const TokenLinkedToPosterContractLink: FC = () => {
  const { isTokenLinkedToPosterLoading, TokenContractLinkedToPosterAddress, name } = tokenLinkedToPosterStore;

  if (isTokenLinkedToPosterLoading) {
    return <Skeleton className="h-3 w-[80px]"/>;
  }

  if (!TokenContractLinkedToPosterAddress) {
    return <p>Не удалось получить адрес контракта</p>;
  }

  return (
    <Link
      href={mumbaiAddressUrl(TokenContractLinkedToPosterAddress)}
      target="_blank"
    ><AiFillSecurityScan/>&nbsp;{name}Contract</Link>
  );
};
