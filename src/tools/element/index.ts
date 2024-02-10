import { PACKAGE_NAME, getPackageName } from "@nui-tools/core";
export { property } from "@nui-tools/property";

const PACKAGE_PREFIX = PACKAGE_NAME.slice(0, 1).toUpperCase() + PACKAGE_NAME.slice(1);

export function element(tag: string, styles?: string) {
  return function <E extends typeof HTMLElement>(targetClass: E): E {

    const DecoratedClass =
      // @ts-ignore mixin class constructor arguments
      class extends targetClass {
        #properties: Map<string, any> = new Map();

        constructor() {
          super();

          // @ts-ignore observedAttributes is not defined on HTMLElement
          const { observedAttributes } = this.constructor;
          for (let idx = 0; idx < (observedAttributes || []).length; idx++) {
            const property = observedAttributes[idx] as string & keyof this;
            const descriptor = Object.getOwnPropertyDescriptor(this, property);
            if (!descriptor || descriptor.configurable) {
              const defaultValue = this[property] as any;
              delete this[property];

              const get = (): string|number|boolean|null => {
                const value = this.getAttribute(property);
                if (value === null) return null;
                if (value === '') return true;
                if (value === 'false') return false;
                if (Number.isNaN(Number(value))) return value;
                return Number(value);
              }

              const set = (value: string|number|boolean|null) => {
                if (value === get()) return;

                if (value === null) {
                  this.removeAttribute(property);
                } else if (typeof value === 'boolean') {
                  if (value) this.toggleAttribute(property, value);
                  else this.setAttribute(property, 'false');
                } else {
                  this.setAttribute(property, String(value));
                }

                descriptor?.set?.call(this, value);
              };

              Object.defineProperty(this, property, { configurable: false, enumerable: true, get, set });
              if (undefined !== defaultValue) set(defaultValue);
            }
          }

          if (styles) {
            Promise.resolve().then(() => {
              return this.shadowRoot || this.attachShadow({ mode: 'open' });
            }).then((shadowRoot) => {
              const style = document.createElement('style');
              style.innerHTML = styles;
              shadowRoot.prepend(style);
            });
          }

          this.dispatchEvent(new Event(`${tag}::constructor`));
        }

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
          // @ts-ignore attributeChangedCallback is not defined on HTMLElement
          targetClass.prototype.attributeChangedCallback?.call(this, name, oldValue, newValue);

          // @ts-ignore observedAttributes is not defined on HTMLElement
          const { observedAttributes } = this.constructor;
          if (observedAttributes.includes(name)) {
            const descriptor = Object.getOwnPropertyDescriptor(targetClass.prototype, name);
            descriptor?.set?.call(this, newValue);
          }
        }
      }

    Object.defineProperty(DecoratedClass, 'name', {
      value: `HTML${PACKAGE_PREFIX}${targetClass.name.replace(new RegExp(`^HTML(${PACKAGE_PREFIX})?`), '')}`
    });

    if (typeof window !== 'undefined') {
      const name = getPackageName(tag.replace(new RegExp(`^${PACKAGE_NAME}-`), ''));
      customElements.define(name, DecoratedClass as CustomElementConstructor)
    }

    return DecoratedClass;
  }
}

function decorate<E extends HTMLElement>(target: E, property: string & keyof E) {
  const descriptor = Object.getOwnPropertyDescriptor(target, property);
  if (descriptor && !descriptor?.configurable) return;

  const defaultValue: string|number|boolean|null = target[property] as any;
  delete target[property];

  function get(): string|number|boolean|null {
    const value = target.getAttribute(property);
    if (null === value) return null;
    if ('' === value) return true;
    if ('false' === value) return false;
    if (!Number.isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }

  function set(value: string|number|boolean|null) {
    const previous = get();
    if (value === null) {
      target.removeAttribute(property);
      descriptor?.set?.call(target, value);
    } else if (value !== previous) {
      if (typeof value === 'boolean') {
        if (value) {
          target.toggleAttribute(property, value);
        } else {
          target.setAttribute(property, 'false');
        }
      } else {
        target.setAttribute(property, String(value));
      }
      descriptor?.set?.call(target, value);
    }
  }

  Object.defineProperty(target, property, { configurable: false, enumerable: true, get, set });
  if (undefined !== defaultValue) set(defaultValue);
}
