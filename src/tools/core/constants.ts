export const PACKAGE_NAME = 'nui';

export function getPackageName(suffix?: string, separator: string = '-') {
  if (!suffix) return PACKAGE_NAME;
  return `${PACKAGE_NAME}${separator}${suffix}`;
}

export function getPrivatePackageName(suffix: string, prefix?: string, separator: string = '::') {
  return `§§${getPackageName(prefix)}${separator}${suffix}`;
}
