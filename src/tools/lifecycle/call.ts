import type { LifecycleListener, LifecycleMemory } from "./assign";
import { getLifecycles } from "./assign";

export function callLifecycle<E extends HTMLElement, K extends keyof LifecycleMemory<E>>(target: E, name: K, ...args: Parameters<LifecycleListener<E, K>>) {
  const lifecycles = getLifecycles(target.constructor as typeof HTMLElement);
  for (let idx = 0; idx < lifecycles[name].length; idx++) {
    lifecycles[name][idx].call(target, ...args);
  }
}
