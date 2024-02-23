export function transformAttributeValue(value: string|number|boolean|null) {
  if (null === value) return null;
  if ('' === value) return true;
  if ('false' === value) return false;
  if ('true' === value) return true;
  if ('boolean' === typeof value) return value;
  if ('number' === typeof value) return value;
  if (!Number.isNaN(Number(value))) return Number(value);
  return value;
}
