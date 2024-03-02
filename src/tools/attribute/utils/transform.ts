import type { AttributeTransform, AttributeType, AttributeValue } from "./define";

export function transformAttributeValue(name: string, value: AttributeType): AttributeType {
  if (null === value) return null;
  if ('' === value) return true;
  if ('false' === value) return false;
  if ('true' === value) return true;
  if ('boolean' === typeof value) return value;
  if ('number' === typeof value) return value;
  if (!Number.isNaN(Number(value))) return Number(value);
  if (name === value) return true;
  return value;
}

type ReturnTypeChainTransform<
  E extends HTMLElement,
  CurrentTransform extends AttributeTransform<E, any>|undefined,
  PreviousTransform extends AttributeTransform<E, any>|undefined,
> =
  CurrentTransform extends AttributeTransform<E, infer R1> ? R1 :
    PreviousTransform extends AttributeTransform<E, infer R2> ? R2 :
      AttributeType;

export function chainTransforms<
  E extends HTMLElement,
  T1 extends AttributeTransform<E>,
  T2 extends T1|AttributeTransform<E>,
>(
  currentTransform?: T1,
  previousTransform?: T2
): T1|AttributeTransform<E, ReturnTypeChainTransform<E, T1, T2>> {
  if (currentTransform !== undefined && previousTransform !== undefined) {
    if (currentTransform === previousTransform) {
      return currentTransform;
    }
  }

  return function (value: AttributeType): ReturnTypeChainTransform<E, T1, T2> {
    const previousTransformedValue = previousTransform?.call(this, value);
    if (undefined !== previousTransformedValue) value = previousTransformedValue;

    const transformedValue = currentTransform?.call(this, value) || value;
    if (undefined === transformedValue) value = transformedValue;

    return value as ReturnTypeChainTransform<E, T1, T2>;
  }
}

export function chainDefaultTransform<E extends HTMLElement, R extends AttributeValue>(target: E, name: string, transform?: AttributeTransform<E, R>): AttributeTransform<E, R> {
  const basic = transformAttributeValue.bind(target, name);
  return chainTransforms(transform, basic);
}
