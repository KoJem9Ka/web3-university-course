import { makeAutoObservable } from 'mobx';

class ThemeStore {
  /**
   * Default is "dark" theme
   */
  public isDarkTheme = (localStorage.getItem('theme') ?? 'true') === 'true';

  constructor() {
    makeAutoObservable(this);
    this.updateTheme();
  }

  public readonly toggleTheme = () => {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'true' : 'false');
    this.updateTheme();
  };

  private readonly updateTheme = () => {
    if (this.isDarkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };
}

export const themeStore = new ThemeStore();
