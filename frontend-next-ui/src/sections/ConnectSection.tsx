import { observer } from 'mobx-react-lite';
import { userStore } from '../stores/user-store.ts';
import { Link } from '@nextui-org/react';

export const ConnectSection = observer(() => {
  const { isUserLoading, authorize } = userStore;

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-2xl pb-3">👛 Подключите кошелёк</h2>
      <p>Для работы с приложением вам необходимо&nbsp;
        <Link isDisabled={isUserLoading} className='cursor-pointer' onClick={authorize}>подключить MetaMask</Link>
        &nbsp;🌐⛓️🔌
      </p>
      <p>Вы сможете переводить токены 🚀 и создавать посты 📢</p>
    </div>
  );
});
