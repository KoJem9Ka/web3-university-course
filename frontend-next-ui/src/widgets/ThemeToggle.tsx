import { FC } from 'react';
import { Button } from '@nextui-org/react';
import { themeStore } from '../stores/theme-store.ts';
import { observer } from 'mobx-react-lite';

export const ThemeToggle: FC = observer(() => {
  const { isDarkTheme, toggleTheme } = themeStore;
  return (
    <Button className="text-xl" isIconOnly radius="full" variant="light" onClick={toggleTheme}>
      {isDarkTheme ? '☀️' : '🌙'}
    </Button>
  );
});
