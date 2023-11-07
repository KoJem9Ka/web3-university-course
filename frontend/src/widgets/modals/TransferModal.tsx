import { ChangeEventHandler, FC, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Input, InputNumber, InputNumberProps, Modal, Typography } from 'antd';
import { helloTokenContractStore } from '../../stores/hello-token-contract.store.ts';
import { userStore } from '../../stores/user-store.ts';
import type { Address } from 'abitype';
import { isAddress } from 'viem';
import { toMoreReadable, toNormal, toStoreFormat } from '../../helpers';
import { PopoverInfo } from '../PopoverInfo.tsx';
import { getAccount, HelloContract } from '../../contracts';

export const TransferModal: FC = observer(() => {
  const { isHelloContractLoading, symbol, isTransferModalOpen, transferModalClose, decimals } = helloTokenContractStore;
  const { isUserLoading, balance, account } = userStore;
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const isLoading = isTransferLoading || isHelloContractLoading || isUserLoading;

  const [receiver, setReceiver] = useState<Address>('0x');
  const [tokensCount, setTokensCount] = useState<number>(0);

  const receiverError = receiver === account ? 'Нельзя перевести токены самому себе'
    : !isAddress(receiver) ? 'Неверный адрес получателя'
      : !receiver ? 'Адрес получателя обязателен для заполнения'
        : null;
  const tokensCountError = tokensCount <= 0 ? 'Кол-во токенов должно быть больше 0'
    : balance && toStoreFormat(tokensCount, decimals) > balance ? `Вы можете перевести не больше ${toNormal(balance, decimals)} ${symbol}`
      : null;
  const isInputValid = !receiverError && !tokensCountError;

  const [isReceiverErrorVisible, setIsReceiverErrorVisible] = useState(false);
  const [isTokensCountErrorVisible, setIsTokensCountErrorVisible] = useState(false);

  const timeoutReceiverRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const timeoutTokensCountRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const handleOk = async () => {
    try {
      setIsTransferLoading(true);
      await HelloContract.write.transfer([receiver, toStoreFormat(tokensCount, decimals)], { account: await getAccount(true) });
      await userStore.refetchUser();
      transferModalClose();
    } catch (e) {
      const errorMessage = `Ошибка перевода: ${e instanceof Error ? e.message : e}`;
      alert(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsTransferLoading(false);
    }
  };

  const afterOpenChange = () => {
    setReceiver('0x');
    setTokensCount(0);
    setIsReceiverErrorVisible(false);
    setIsTokensCountErrorVisible(false);
  };
  const onReceiverChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    clearTimeout(timeoutReceiverRef.current);
    timeoutReceiverRef.current = setTimeout(() => setIsReceiverErrorVisible(true), 1000);
    setReceiver(e.target.value as Address);
    setIsReceiverErrorVisible(false);
  };
  const onTokensCountChange: InputNumberProps['onChange'] = (value) => {
    clearTimeout(timeoutTokensCountRef.current);
    timeoutTokensCountRef.current = setTimeout(() => setIsTokensCountErrorVisible(true), 1000);
    setTokensCount(Number(value) || 0);
    setIsTokensCountErrorVisible(false);
  };

  return (
    <Modal
      title={`Перевод ${symbol}`}
      cancelText="Отмена"
      okText="Перевести"
      okButtonProps={{ disabled: isLoading || !isInputValid }}
      open={isTransferModalOpen}
      onCancel={transferModalClose}
      onOk={handleOk}
      afterOpenChange={afterOpenChange}
    >
      <Typography.Text type="secondary">Адрес получателя</Typography.Text>
      <Input
        readOnly={isLoading}
        value={receiver}
        onChange={onReceiverChange}
        status={isReceiverErrorVisible && receiverError ? 'error' : undefined}
        suffix={isReceiverErrorVisible && receiverError ? <PopoverInfo isError content={receiverError}/> : <span/>}
        className="mb-2"
      />
      <Typography.Text type="secondary">Кол-во {symbol}</Typography.Text>
      <div className="relative">
        <InputNumber
          readOnly={isLoading}
          value={tokensCount}
          onChange={onTokensCountChange}
          status={isTokensCountErrorVisible && tokensCountError ? 'error' : undefined}
          className="w-full"
        />
        <PopoverInfo
          isError={isTokensCountErrorVisible && !!tokensCountError}
          content={tokensCountError || `Фактически будет переведено ${toMoreReadable(toStoreFormat(tokensCount, decimals))} ед.`}
          className="absolute top-2 right-3"
        />
      </div>
    </Modal>
  );
});
