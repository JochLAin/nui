import type { ClassDecorator, HTMLElementClass, MethodDecorator } from "../utils";
import { callParentMethod, setupMetadata } from "../utils";

export type LifecycleRecord<T extends HTMLElement> = {
  initializedCallback: (this: T) => void;
  connectedCallback: (this: T) => void;
  adoptedCallback: (this: T) => void;
  attributeChangedCallback: (this: T, name: string, oldValue: string, newValue: string) => void;
  disconnectedCallback: (this: T) => void;
}

export type LifecycleKey<T extends HTMLElement = HTMLElement> = keyof LifecycleRecord<T>;
export type LifecycleListener<K extends LifecycleKey = LifecycleKey, T extends HTMLElement = HTMLElement> = (...args: LifecycleParameters<K, T>) => void;
export type LifecycleParameters<K extends LifecycleKey, T extends HTMLElement = HTMLElement> = Parameters<LifecycleRecord<T>[K]>;

export type Lifecycle = { name: LifecycleKey, listener: LifecycleListener };

const metadata = setupMetadata<Lifecycle>(Symbol('lifecycle'), { collection: true });

function assign<E extends HTMLElement, K extends LifecycleKey<E>, L extends LifecycleListener<K>>(target: E, key: K, listener: L): void;
function assign<C extends HTMLElementClass, K extends LifecycleKey, L extends LifecycleListener<K>>(target: C, key: K, listener: L): void;
function assign<E extends HTMLElement, C extends HTMLElementClass, K extends LifecycleKey, L extends LifecycleListener<K>>(target: E|C, key: K, listener: L) {
  // ¿ qué ? TypeScript need this to infer the correct type
  if (target instanceof HTMLElement) {
    return metadata.store(target, { name: key, listener });
  }
  return metadata.store(target, { name: key, listener });
}

export function call<E extends HTMLElement, K extends LifecycleKey<E>>(target: E, key: K, ...args: Parameters<LifecycleRecord<E>[K]>): void {
  const lifecycles = metadata.recover(target);
  for (let idx = 0; idx < lifecycles.length; idx++) {
    const { name, listener } = lifecycles[idx];
    if (name !== key) continue;
    listener.call(target, ...args);
  }
}

export function callParent<T extends typeof HTMLElement, E extends HTMLElement, K extends LifecycleKey<E>, A extends LifecycleParameters<K, E>>(targetClass: T, target: E, name: K, ...args:  A): void {
  return callParentMethod<T, E, K, A, void>(targetClass, target, name, ...args);
}

function check(lifecycle: string): lifecycle is LifecycleKey {
  return [
    'initializedCallback',
    'connectedCallback',
    'adoptedCallback',
    'attributeChangedCallback',
    'disconnectedCallback',
  ].includes(lifecycle);
}

export function decorate<C extends HTMLElementClass, K extends LifecycleKey>(name: K, callback: LifecycleListener<K>): ClassDecorator<C>;
export function decorate<E extends HTMLElement, K extends LifecycleKey>(target: E, name: K, callback: LifecycleListener<K, E>): void;
export function decorate<E extends HTMLElement>(): MethodDecorator<E>;
export function decorate<E extends HTMLElement, C extends HTMLElementClass, K extends LifecycleKey>(arg1?: E|K, arg2?: K|LifecycleListener<K, E>, arg3?: LifecycleListener<K, E>) {
  if (typeof arg1 === 'string') {
    if (typeof arg2 !== 'function') throw new Error(`[Class @lifecycle] Listener must be a function, got ${typeof arg2}`);
    if (typeof arg3 !== 'undefined') throw new Error(`[Class @lifecycle] Expected 2 arguments, got 3`);
    return (target: C) => assign(target, arg1, arg2);
  }

  if (arg1 instanceof HTMLElement) {
    if (typeof arg2 !== 'string') throw new Error(`[Call @lifecycle] Key must be a string, got ${typeof arg2}`);
    if (typeof arg3 !== 'function') throw new Error(`[Call @lifecycle] Listener must be a function, got ${typeof arg3}`);
    return assign(arg1, arg2, arg3);
  }

  return function decorate(target: E, property: string|symbol, descriptor: PropertyDescriptor) {
    if (typeof property !== 'symbol') throw new Error(`Expected property name to be a symbol, got ${typeof property}`);
    if (descriptor.get) throw new Error(`[Method @lifecycle] Property cannot have a getter`);
    if (descriptor.value !== undefined && typeof descriptor.value !== 'function') throw new Error(`[Method @lifecycle] Property must be a function`);

    const name = property.toString().slice(7, -1);
    if (!check(name)) throw new Error(`Expected initializedCallback, connectedCallback, disconnectedCallback, adoptedCallback or attributeChangedCallback as listener, got ${name}`);
    return assign(target.constructor as HTMLElementClass, name, descriptor.value || descriptor.set);
  }
}
