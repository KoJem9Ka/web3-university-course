import { makeAutoObservable } from 'mobx';

class ToastStore {
  messages: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get message() {
    return this.messages.at(0);
  }

  public readonly pushMessage = (message: string) => {
    this.messages.push(message);
  };

  public readonly popMessage = () => {
    this.messages.shift();
  };
}

export const toastStore = new ToastStore();
