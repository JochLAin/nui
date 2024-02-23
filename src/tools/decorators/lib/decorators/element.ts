import { ElementClass, ElementInstance } from "../classes/element";
import { defineAttribute, decorateClass, transformAttributeValue } from "../utils";

export type ElementOpts<T extends HTMLElement = HTMLElement> = {
  properties?: Record<string, ElementPropertyDescriptor<ElementInstance<T>>|null>;
}

type ElementPropertyDescriptor<E extends HTMLElement, T extends string|number|boolean|null = any> = {
  configurable?: boolean;
  enumerable?: boolean;
  value?: T;
  writable?: boolean;
  get?(element: E): T;
  set?(element: E, value: T): void;
}

export function element<
  T extends HTMLElement = HTMLElement,
  C extends ElementClass<T> = ElementClass<T>,
  I extends ElementInstance<T> = ElementInstance<T>
>(tag: string, opts?: ElementOpts<T>) {
  return function <E extends C>(targetClass: E): E {
    if (typeof window !== 'undefined') {
      const element = customElements.get(tag);
      if (element?.prototype instanceof targetClass) return element as E;
      if (element) throw new Error(`The element ${tag} is already defined as a different class.`);
    }

    // @ts-ignore mixin classes constructor arguments
    const DecoratedClass = decorateClass<E>('Decorated', targetClass.name, class extends targetClass implements I {
      public static observedAttributes = Array.from(new Set([...(targetClass.observedAttributes || []), ...Object.keys(opts?.properties || {})]));

      public static get[Symbol.for('nui-decorator-element')]() {
        return true;
      }

      constructor() {
        super();

        const innerProperties = opts?.properties || {};
        const innerPropertiesKeys = Object.keys(innerProperties);

        const { observedAttributes = [] } = this.constructor as E;
        const attributes = observedAttributes.filter(attr => !innerPropertiesKeys.includes(attr));
        for (let idx = 0; idx < attributes.length; idx++) {
          defineAttribute(this, attributes[idx] as string & keyof this);
        }

        for (let idx = 0; idx < innerPropertiesKeys.length; idx++) {
          const name = innerPropertiesKeys[idx] as string & keyof this;
          const descriptor = innerProperties[name] || {};

          const {
            configurable = true,
            enumerable = true,
            get: getter,
            set: setter,
            value,
            writable = true
          } = descriptor;

          if (getter || setter) {
            const get = getter?.bind(this, this as unknown as I);
            const set = setter?.bind(this, this as unknown as I);
            defineAttribute(this, name, { configurable, enumerable, get, set });
          } else {
            defineAttribute(this, name, { configurable, enumerable, writable, value });
          }
        }

        for (let idx = 0; idx < observedAttributes.length; idx++) {
          const property = observedAttributes[idx] as string & keyof this;
          const value = this[property];
          if (undefined !== value && null !== value) {
            this[property] = value;
          }
        }

        this.initializedCallback?.();
      }

      public attributeChangedCallback = (name: string, oldValue: string, newValue: string) => {
        targetClass.prototype.attributeChangedCallback?.call(this, name, oldValue, newValue);

        const { observedAttributes = [] } = this.constructor as E;
        if (observedAttributes.includes(name)) {
          const descriptor = Object.getOwnPropertyDescriptor(targetClass.prototype, name);
          descriptor?.set?.call(this, transformAttributeValue(newValue));
        }
      }
    });

    if (typeof window !== 'undefined') {
      customElements.define(tag, DecoratedClass as CustomElementConstructor)
    }

    return DecoratedClass;
  }
}
