import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { helloTokenContractStore } from '../stores/hello-token-contract.store.ts';
import { Button, Card, CardBody, CardFooter, Input, Link } from '@nextui-org/react';
import type { Address } from 'abitype';
import { toMoreReadable, toStoreFormat } from '../helpers';
import { isAddress } from 'viem';
import { userStore } from '../stores/user-store.ts';
import { getAccount, HelloContract } from '../contracts';
import { toast } from 'sonner';
import { mumbaiTxUrl } from '../shared/constants.ts';
import { useFormik } from 'formik';
import { every } from 'lodash';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  recipient: yup.string().required('Адрес обязателен')
    .test('isValidAddress', 'Некорректный адрес', value => isAddress(value)),
  amount: yup.number()
    .required('Количество обязательно')
    .typeError('Неверное количество')
    .positive('Количество должно быть больше нуля'),
});

export const MintSection: FC = observer(() => {
  const { isUserLoading } = userStore;
  const { isHelloContractLoading, decimals } = helloTokenContractStore;

  const formik = useFormik<{ recipient: Address, amount: string }>({
    initialValues: { recipient: '0x', amount: '0' },
    initialTouched: { recipient: false, amount: false },
    validationSchema,
    onSubmit: async ({ recipient, amount }) => {
      try {
        const tx = await HelloContract.write.mint(
          [recipient, toStoreFormat(amount, decimals)],
          { account: await getAccount(true) },
        );
        toast.success(<>
          {'✔️ '}
          <Link className='whitespace-nowrap' showAnchorIcon href={mumbaiTxUrl(tx)} target="_blank">Транзакция</Link>
          {' чеканки токенов создана!'}
        </>);
      } catch (error) {
        const errorMessage = `Ошибка создания токенов: ${error instanceof Error ? error.message : error}`;
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const isLoading = formik.isSubmitting || isUserLoading || isHelloContractLoading;
  const isSubmittable = !isLoading && (!every(formik.touched) || formik.isValid);

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-end text-3xl mb-3">Создание токенов</h2>
      <Card>
        <CardBody className="flex flex-col gap-3">
          <Input
            {...formik.getFieldProps('recipient')}
            label="Получатель"
            labelPlacement="outside"
            startContent={'😎'}
            readOnly={isLoading}
            errorMessage={formik.touched.recipient && formik.errors.recipient}
            isInvalid={formik.touched.recipient && !!formik.errors.recipient}
          />
          <Input
            {...formik.getFieldProps('amount')}
            label="Количество"
            labelPlacement="outside"
            startContent={'💎'}
            readOnly={isLoading}
            errorMessage={formik.touched.amount && formik.errors.amount}
            isInvalid={formik.touched.amount && !!formik.errors.amount}
          />
        </CardBody>
        <CardFooter className="justify-between">
          <p className="text-gray-500">Будет создано {toMoreReadable(toStoreFormat(formik.values.amount, decimals))} ед.</p>
          <Button
            disabled={!isSubmittable}
            isLoading={isLoading}
            color={isSubmittable || isLoading ? 'primary' : 'danger'}
            variant={!isSubmittable ? 'faded' : undefined}
            className={!isSubmittable ? 'cursor-not-allowed' : undefined}
            onClick={() => formik.handleSubmit()}
          >Создать</Button>
        </CardFooter>
      </Card>
    </div>
  );
});
