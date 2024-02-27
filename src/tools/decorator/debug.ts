import type { HTMLNuiElementConstructor } from "@nui-tools/model";
import type { ClassDecorator } from "@nui-tools/decorator";
import { decorateClass } from "@nui-tools/decorator";

export function debug<T extends HTMLNuiElementConstructor>(): ClassDecorator<T> {
  return function decorator<C extends T>(targetClass: C): C {
    return decorateClass(targetClass, {
      listeners: {
        initializedCallback(...args) {
          console.log('initializedCallback', this, ...args);
        },
        connectedCallback(...args) {
          console.log('connectedCallback', this, ...args);
        },
        adoptedCallback(...args) {
          console.log('adoptedCallback', this, ...args);
        },
        attributeChangedCallback(...args) {
          console.log('attributeChangedCallback', this, ...args);
        },
        disconnectedCallback(...args) {
          console.log('disconnectedCallback', this, ...args);
        },
      },
    });
  }
}
