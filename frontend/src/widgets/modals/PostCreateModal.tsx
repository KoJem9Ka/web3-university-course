import { ChangeEventHandler, FC, useRef, useState } from 'react';
import { Divider, Input, Modal, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { posterContractStore, PosterContractVersionEnum } from '../../stores/poster-contract.store.ts';
import { PopoverInfo } from '../PopoverInfo.tsx';
import { PosterContractVersionSwitcher } from '../PosterContractVersionSwitcher.tsx';
import { tokenLinkedToPosterStore } from '../../stores/token-linked-to-poster.store.ts';

export const PostCreateModal: FC = observer(() => {
  const { isPostsLoading, isPostCreateModalOpen, version, postCreateModalClose, createPost } = posterContractStore;
  const { isTokenLinkedToPosterLoading, missingTokensReadable, thresholdReadable } = tokenLinkedToPosterStore;
  const isLoading = isPostsLoading || isTokenLinkedToPosterLoading;

  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');

  const tagError = !tag ? 'Тэг обязателен для заполнения' : undefined;
  const contentError = !content ? 'Содержимое обязательно для заполнения' : undefined;
  const isInputValid = !tagError && !contentError;

  const [isTagErrorVisible, setIsTagErrorVisible] = useState(false);
  const [isContentErrorVisible, setIsContentErrorVisible] = useState(false);

  const timeoutTagRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const timeoutContentRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const handleOk = async () => {
    await createPost({ tag, content });
    postCreateModalClose();
  };

  const afterOpenChange = () => {
    setTag('');
    setContent('');
    setIsTagErrorVisible(false);
    setIsContentErrorVisible(false);
  };

  const onTagChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    clearTimeout(timeoutTagRef.current);
    timeoutTagRef.current = setTimeout(() => setIsTagErrorVisible(true), 1000);
    setTag(e.target.value);
    setIsTagErrorVisible(false);
  };

  const onContentChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    clearTimeout(timeoutContentRef.current);
    timeoutContentRef.current = setTimeout(() => setIsContentErrorVisible(true), 1000);
    setContent(e.target.value);
    setIsContentErrorVisible(false);
  };

  return (
    <Modal
      cancelText="Отмена"
      okText="Создать"
      title="Создание поста"
      open={isPostCreateModalOpen}
      onCancel={postCreateModalClose}
      onOk={handleOk}
      okButtonProps={{ disabled: !isInputValid || isLoading }}
      afterOpenChange={afterOpenChange}
    >
      <Divider plain>Контракт:&nbsp;&nbsp;&nbsp;<PosterContractVersionSwitcher size="small"/></Divider>
      <div className="flex gap-3">
        {version === PosterContractVersionEnum.Gated &&
          <Typography.Text className="mb-3">
            {!missingTokensReadable && <>✅&nbsp;</>}
            На счету должно быть минимум {thresholdReadable}
          </Typography.Text>
        }
      </div>
      {version === PosterContractVersionEnum.Gated && missingTokensReadable
        ? <Typography.Text>❌&nbsp;{missingTokensReadable}</Typography.Text>
        : <>
          <Typography.Text type="secondary">Тэг</Typography.Text>
          <Input
            readOnly={isLoading}
            value={tag}
            onChange={onTagChange}
            status={isTagErrorVisible && !tag ? 'error' : undefined}
            suffix={isTagErrorVisible && !tag ? <PopoverInfo isError content="Тэг обязателен для заполнения"/> : <span/>}
          />
          <Typography.Text type="secondary">Содержимое</Typography.Text>
          <div className="relative">
            <Input.TextArea
              readOnly={isLoading}
              value={content}
              onChange={onContentChange}
              status={isContentErrorVisible && !content ? 'error' : undefined}
              autoSize={{ minRows: 3, maxRows: 10 }}
            />
            {isContentErrorVisible && !content && (
              <PopoverInfo
                isError
                content="Содержимое обязательно для заполнения"
                className="absolute top-3 right-3"
              />
            )}
          </div>
        </>}
    </Modal>
  );
});
