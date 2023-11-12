import { useFormik } from 'formik';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import { posterContractStore, PosterContractVersionEnum } from '../../stores/poster-contract.store.tsx';
import * as yup from 'yup';
import { tokenLinkedToPosterStore } from '../../stores/token-linked-to-poster.store.ts';
import { PosterVersionSwitcher } from './PosterVersionSwitcher.tsx';
import { every } from 'lodash';
import { useAsyncEffect } from 'ahooks';

const schema = yup.object().shape({
  tag: yup.string().required('Тэг обязателен'),
  content: yup.string().required('Содержимое обязательно'),
});

export const PostCreateModal: FC = observer(() => {
  const { version, isPostCreateModalOpen, postCreateModalClose, createPost } = posterContractStore;
  const { isTokenLinkedToPosterLoading, thresholdReadable, missingTokensReadable, refetchTokenLinkedToPoster } = tokenLinkedToPosterStore;

  const formik = useFormik<{ tag: string, content: string }>({
    initialValues: { tag: '', content: '' },
    initialTouched: { tag: false, content: false },
    validationSchema: schema,
    onSubmit: async (values) => createPost(values).then(postCreateModalClose),
  });

  useAsyncEffect(async () => {
    if (isPostCreateModalOpen) {
      await refetchTokenLinkedToPoster();
    }
  }, [isPostCreateModalOpen]);

  const isLoading = isTokenLinkedToPosterLoading || formik.isSubmitting;
  const isSubmittable = !isLoading && (!every(formik.touched) || formik.isValid) && !missingTokensReadable;

  return (
    <Modal
      backdrop="blur"
      isOpen={isPostCreateModalOpen}
      onClose={postCreateModalClose}
      onOpenChange={() => formik.resetForm()}
    >
      <ModalContent>
        <ModalHeader className="gap-3 items-center">
          <h2 className="text-3xl font-semibold">Создание поста</h2>
          <PosterVersionSwitcher size="sm"/>
        </ModalHeader>
        <ModalBody>
          {version === PosterContractVersionEnum.Gated && <div>
            <p>{!missingTokensReadable ? '✅ ' : null}На вашем счету должно быть минимум {thresholdReadable}</p>
            {missingTokensReadable && <p>⛔ Вам не хватает {missingTokensReadable} токенов</p>}
          </div>}
          <Input
            {...formik.getFieldProps('tag')}
            label="Тэг"
            labelPlacement="outside"
            placeholder="&nbsp;"
            readOnly={isLoading}
            errorMessage={formik.touched.tag && formik.errors.tag}
            isInvalid={formik.touched.tag && !!formik.errors.tag}
          />
          <Textarea
            {...formik.getFieldProps('content')}
            label="Содержимое"
            labelPlacement="outside"
            placeholder="&nbsp;"
            readOnly={isLoading}
            errorMessage={formik.touched.content && formik.errors.content}
            isInvalid={formik.touched.content && !!formik.errors.content}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={!isSubmittable}
            isLoading={isLoading}
            color={isSubmittable || isLoading ? 'primary' : 'danger'}
            variant={!isSubmittable ? 'faded' : undefined}
            className={!isSubmittable ? 'cursor-not-allowed' : undefined}
            onClick={() => formik.handleSubmit()}
          >Создать</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
