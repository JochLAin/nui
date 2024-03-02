import { decorateStatic } from "@nui-tools/decorator";

export type LifecycleRecord<T extends HTMLElement> = {
  initializedCallback: (this: T) => void;
  connectedCallback: (this: T) => void;
  adoptedCallback: (this: T) => void;
  attributeChangedCallback: (this: T, name: string, oldValue: string, newValue: string) => void;
  disconnectedCallback: (this: T) => void;
  [key: string]: (this: T, ...args: any[]) => void;
}

export type LifecycleKey<T extends HTMLElement> = keyof LifecycleRecord<T>;

export type LifecycleListener<T extends HTMLElement, K extends keyof LifecycleMemory<T>> =
  (...args: Parameters<LifecycleRecord<T>[K]>) => ReturnType<LifecycleRecord<T>[K]>;

export type LifecycleMemory<T extends HTMLElement = HTMLElement> = {
  [K in keyof LifecycleRecord<T>]: LifecycleListener<T, K>[];
}

export const LIFECYCLE_CALLBACKS: LifecycleMemory = {
  initializedCallback: [],
  connectedCallback: [],
  adoptedCallback: [],
  attributeChangedCallback: [],
  disconnectedCallback: []
};

export function getLifecycles(target: typeof HTMLElement): LifecycleMemory {
  if ('lifecycleCallbacks' in target) {
    return target.lifecycleCallbacks as LifecycleMemory;
  }
  return LIFECYCLE_CALLBACKS;
}

export function assignMultipleLifecycles<
  E extends typeof HTMLElement,
  I extends InstanceType<E>,
>(target: E, listeners: Partial<LifecycleRecord<I>>) {
  const keys = Object.keys(listeners);

  decorateStatic(target, (target) => {
    const callbacks = getLifecycles(target);

    for (let idx = 0; idx < keys.length; idx++) {
      const key = keys[idx] as keyof LifecycleRecord<I>;
      const listener = listeners[key];
      Object.assign(callbacks, { [key]: [...callbacks[key], listener] });
    }

    Object.assign(target, { lifecycleCallbacks: callbacks });
  });
}

export function assignLifecycle<
  E extends typeof HTMLElement,
  I extends InstanceType<E>,
  K extends keyof LifecycleMemory
>(target: E, name: K, callback: LifecycleListener<I, K>) {
  decorateStatic(target, (target) => {
    const callbacks = getLifecycles(target);

    Object.assign(target, {
      lifecycleCallbacks: {
        ...callbacks,
        [name]: [
          ...callbacks[name],
          callback
        ],
      },
    });
  });
}
