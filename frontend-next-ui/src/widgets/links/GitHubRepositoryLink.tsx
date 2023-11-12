import { TfiGithub } from 'react-icons/tfi';
import { Link } from '@nextui-org/react';
import { FC } from 'react';

export const GitHubRepositoryLink: FC = () => (
  <Link
    href="https://github.com/KoJem9Ka/web3-university-course"
    target="_blank"
  ><TfiGithub/>&nbsp;GitHub</Link>
);
