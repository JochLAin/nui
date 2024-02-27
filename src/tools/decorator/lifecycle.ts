import type { PropertyDecorator } from "@nui-tools/decorator";
import type { LifecycleMemory, LifecycleListener } from "@nui-tools/lifecycle";
import { assignLifecycle, checkLifecycle } from "@nui-tools/lifecycle";

function decorator<E extends HTMLElement>() {
  return function decorate<T extends E>(obj: T, p: string|symbol): void {
    const property = p as (string|symbol) & keyof T;
    if (typeof property !== 'symbol') {
      throw new Error(`Expected property name to be a symbol, got ${typeof property}`);
    }

    const lifecycle = property.toString().slice(7, -1);
    if (!checkLifecycle(lifecycle)) {
      throw new Error(`Expected initializedCallback, connectedCallback, disconnectedCallback, adoptedCallback or attributeChangedCallback as listener, got ${lifecycle}`);
    }

    const value = obj[property];
    if (typeof value !== 'function') {
      throw new Error(`Expected ${lifecycle} to be a function, got ${typeof value}`);
    }

    assignLifecycle(obj.constructor as typeof HTMLElement, lifecycle, value as LifecycleListener<T, typeof lifecycle>);
  }
}

function caller<
  E extends HTMLElement,
  K extends keyof LifecycleMemory
>(target: E, name: K, callback: LifecycleListener<E, K>) {
  assignLifecycle(target.constructor as typeof HTMLElement, name, callback);
}

export function lifecycle<E extends HTMLElement, K extends keyof LifecycleMemory>(target: E, name: K, callback: LifecycleListener<E, K>): void;
export function lifecycle<E extends HTMLElement>(): PropertyDecorator<E>;
export function lifecycle<E extends HTMLElement, K extends keyof LifecycleMemory>(target?: E, key?: K, callback?: LifecycleListener<E, K>): PropertyDecorator<E>|void {
  if (!target && !key && !callback) return decorator();
  if (!target || !key || !callback) throw new Error('Expected target, key and callback as arguments');
  return caller<E, K>(target, key, callback);
}
