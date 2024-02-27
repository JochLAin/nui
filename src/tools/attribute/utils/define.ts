import { chainDefaultTransform, chainTransforms } from './transform';
import { chainListeners } from './listen';

export type AttributeListener<E extends HTMLElement, T extends AttributeValue = AttributeValue> = (this: E, value: T) => void;
export type AttributeTransform<E extends HTMLElement, R extends AttributeValue = AttributeValue> = (this: E, value: AttributeType) => R;
export type AttributeType = null|boolean|number|string;
export type AttributeValue = AttributeType & Exclude<any, undefined|((...args: any[]) => any)>;

export type AttributeDictionary<E extends HTMLElement, R extends AttributeValue = AttributeValue> = Record<string, AttributeDefinition<E, R>>;
export type AttributeDefinition<E extends HTMLElement, R extends AttributeValue = AttributeValue> = {
  name: string,
  transform?: AttributeTransform<E, R>,
  listen?: AttributeListener<E, R>,
  defaultValue?: R,
};

export function chainDefinitions<E extends HTMLElement, R extends AttributeValue = AttributeValue>(
  currentDefinition: AttributeDefinition<E, R>,
  previousDefinition?: AttributeDefinition<E, R>,
): AttributeDefinition<E, R> {
  if (!previousDefinition) return currentDefinition;
  if (previousDefinition.name !== currentDefinition.name) {
    throw new Error(`The attribute name does not match, ${previousDefinition.name} ≠ ${currentDefinition.name}.`);
  }

  return {
    name: currentDefinition.name,
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
  name: string,
  _transform?: AttributeTransform<E, R>,
  listen?: AttributeListener<E, R>,
  defaultValue?: R,
) {
  const property = name as string & keyof typeof target;
  const transform = chainDefaultTransform(target, name, _transform);
  delete target[property];

  const get = (): R => transform.call(target, target.getAttribute(property));
  const set = (value: R) => {
    const previous = get();
    if (value !== previous) {
      if (value === null) {
        target.removeAttribute(property);
      } else if (typeof value === 'boolean') {
        if (value) target.toggleAttribute(property, value);
        else target.setAttribute(property, 'false');
      } else {
        target.setAttribute(property, String(value));
      }
    }

    listen?.call(target, value);
  };

  Object.defineProperty(target, property, { configurable: false, enumerable: true, get, set });
  const currentValue = get();
  if (currentValue !== undefined && currentValue !== null) {
    listen?.call(target, currentValue);
  } else if (undefined !== defaultValue) {
    set(defaultValue);
  }
}
