import { transformAttributeValue } from "./transform";

type ReturnDescriptorGet<D extends ((...args: any[]) => any)|undefined, T> = D extends ((...args: any[]) => any) ? ReturnType<D> : T;

export function getAttributeDescriptor<E extends HTMLElement>(target: E, property: string) {
  // check if classes is instanced with document.createElement()
  if (target.tagName) target = Object.getPrototypeOf(target);
  // check if instance is decorated
  if (target.constructor.hasOwnProperty(Symbol.for('nui-decorator-element'))) {
    target = Object.getPrototypeOf(target);
  }
  return Object.getOwnPropertyDescriptor(target, property);
}

export function defineAttribute<E extends HTMLElement>(target: E, property: string & keyof E, descriptor?: PropertyDescriptor) {
  if (!descriptor) descriptor = getAttributeDescriptor(target, property);
  if (descriptor && !descriptor.configurable) return;

  const defaultValue = target[property] as any;
  delete target[property];
  const getter = descriptor?.get;
  const setter = descriptor?.set;

  const get = (): ReturnDescriptorGet<typeof getter, string|number|boolean|null> => {
    if (getter) return getter();
    return transformAttributeValue(target.getAttribute(property));
  }

  const set = (value: string|number|boolean|null) => {
    const previous = transformAttributeValue(target.getAttribute(property));
    value = transformAttributeValue(value);
    if (value === previous) return;

    if (value === null) {
      target.removeAttribute(property);
    } else if (typeof value === 'boolean') {
      if (value) target.toggleAttribute(property, value);
      else target.setAttribute(property, 'false');
    } else {
      target.setAttribute(property, String(value));
    }

    setter?.call(target, value);
  };

  Object.defineProperty(target, property, { configurable: false, enumerable: true, get, set });
  if (undefined !== defaultValue) set(transformAttributeValue(defaultValue));
}
