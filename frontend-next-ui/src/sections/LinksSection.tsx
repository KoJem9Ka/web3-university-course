import { FC } from 'react';
import { PosterContractLink } from '../widgets/links/PosterContractLink.tsx';
import { PosterGatedContractLink } from '../widgets/links/PosterGatedContractLink.tsx';
import { HelloTokenContractLink } from '../widgets/links/HelloTokenContractLink.tsx';
import { GitHubRepositoryLink } from '../widgets/links/GitHubRepositoryLink.tsx';

export const LinksSection: FC = () => {
  return (
    <div className="max-w-[750px] px-5 mx-auto flex gap-3 justify-between">
      <GitHubRepositoryLink/>
      <PosterContractLink/>
      <HelloTokenContractLink/>
      <PosterGatedContractLink/>
    </div>
  );
};
