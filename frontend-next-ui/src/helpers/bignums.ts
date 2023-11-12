import BigNumber from 'bignumber.js';
import { Falsy } from './falsy.type.ts';

/**
 * Преобразование в нормальный формат
 */
export function toNormal(value: Falsy<bigint>, decimals: Falsy<number>): string {
  try {
    return new BigNumber(value?.toString() || '0').shiftedBy(-(decimals || 0)).toFixed();
  } catch (error) {
    return '0';
  }
}

/**
 * Преобразование обратно в формат хранения
 */
export function toStoreFormat(value: string | number, decimals: Falsy<number>): bigint {
  try {
    return BigInt(new BigNumber(value).shiftedBy(decimals || 0).toFixed());
  } catch (error) {
    return 0n;
  }
}

/**
 * Преобразование в более читаемый формат, расставляя пробелы каждые 3 цифры справа
 */
export function toMoreReadable(value: Falsy<bigint | number>): string {
  try {
    return new BigNumber(value?.toString() || '0').toFormat();
  } catch (error) {
    return '0';
  }
}
