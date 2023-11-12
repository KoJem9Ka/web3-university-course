import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { toastStore } from '../../stores/toast-store.ts';

export const ToastModal: FC = observer(() => {
  const { message, popMessage } = toastStore;

  return (
    <Modal backdrop='blur' isOpen={!!message} onClose={popMessage}>
      <ModalContent>
        <ModalHeader>
          Уведомление
        </ModalHeader>
        <ModalBody>
          {message?.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button onClick={popMessage} color="primary">OK</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
