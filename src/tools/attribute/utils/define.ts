import { chainDefaultTransform, chainTransforms } from './transform';
import { chainListeners } from './listen';

export type AttributeListener<E extends HTMLElement, T extends AttributeValue = AttributeValue> = (this: E, value: T) => void;
export type AttributeTransform<E extends HTMLElement, R extends AttributeValue = AttributeValue> = (this: E, value: AttributeValue) => R;
export type AttributeType = null|boolean|number|string;
export type AttributeValue = AttributeType & Exclude<any, undefined|((...args: any[]) => any)>;

export type AttributeDictionary<E extends HTMLElement, R extends AttributeValue = AttributeValue> = Record<string|symbol, Omit<AttributeDefinition<E, R>, 'propertyName'>>;
export type AttributeDefinition<E extends HTMLElement, R extends AttributeValue = AttributeValue> = {
  propertyName: string|symbol,
  attributeName?: string,
  transform?: AttributeTransform<E, R>,
  listen?: AttributeListener<E, R>,
  defaultValue?: R,
};

export function chainDefinitions<E extends HTMLElement, R extends AttributeValue = AttributeValue>(
  currentDefinition: AttributeDefinition<E, R>,
  previousDefinition?: AttributeDefinition<E, R>,
): AttributeDefinition<E, R> {
  if (!previousDefinition) return currentDefinition;
  if (previousDefinition.propertyName !== currentDefinition.propertyName) {
    throw new Error(`The attribute propertyName does not match, ${previousDefinition.propertyName.toString()} ≠ ${currentDefinition.propertyName.toString()}.`);
  }

  return {
    propertyName: currentDefinition.propertyName,
    attributeName: currentDefinition.attributeName || previousDefinition.attributeName,
    transform: chainTransforms(currentDefinition.transform, previousDefinition.transform),
    listen: chainListeners(currentDefinition.listen, previousDefinition.listen),
    defaultValue: currentDefinition.defaultValue !== undefined
      ? currentDefinition.defaultValue
      : previousDefinition.defaultValue,
  };
}

export function defineAttribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeValue,
>(
  target: E,
  _propertyName: string,
  _attributeName?: string,
  _transform?: AttributeTransform<E, R>,
  listen?: AttributeListener<E, R>,
  defaultValue?: R,
) {
  const propertyName = _propertyName as string & keyof typeof target;
  const attributeName = _attributeName || propertyName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const transform = chainDefaultTransform(target, propertyName, _transform);
  delete target[propertyName];

  const get = (): R => transform.call(target, target.getAttribute(attributeName));
  const set = (value: R) => {
    const previous = get();
    if (value !== previous) {
      if (value === null) {
        target.removeAttribute(attributeName);
      } else if (typeof value === 'boolean') {
        if (value) target.toggleAttribute(attributeName, value);
        else target.setAttribute(attributeName, 'false');
      } else {
        target.setAttribute(attributeName, String(value));
      }
    }
    listen?.call(target, value);
  };

  Object.defineProperty(target, propertyName, { configurable: false, enumerable: true, get, set });

  const currentValue = get();
  if (currentValue !== undefined && currentValue !== null) {
    listen?.call(target, currentValue);
  } else if (undefined !== defaultValue) {
    set(defaultValue);
  }
}
