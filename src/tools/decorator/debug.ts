import type { HTMLNuiElementConstructor } from "@nui-tools/model";
import type { ClassDecorator } from "@nui-tools/decorator";
import { decorateClass } from "@nui-tools/decorator";

export function debug<T extends HTMLNuiElementConstructor>(): ClassDecorator<T> {
  return function decorator<C extends T>(targetClass: C): C {
    return decorateClass(targetClass, {
      listeners: {
        initializedCallback(...args) {
          console.debug('initializedCallback', this, ...args);
        },
        connectedCallback(...args) {
          console.debug('connectedCallback', this, ...args);
        },
        adoptedCallback(...args) {
          console.debug('adoptedCallback', this, ...args);
        },
        attributeChangedCallback(...args) {
          console.debug('attributeChangedCallback', this, ...args);
        },
        disconnectedCallback(...args) {
          console.debug('disconnectedCallback', this, ...args);
        },
      },
    });
  }
}
