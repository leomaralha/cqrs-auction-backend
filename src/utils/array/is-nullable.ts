export function isNullable(value: any) {
  return [null, undefined, '', NaN].includes(value);
}
