import type { LifecycleMemory } from "./assign";

export function checkLifecycle(lifecycle: string): lifecycle is keyof LifecycleMemory {
  return [
    'initializedCallback',
    'connectedCallback',
    'adoptedCallback',
    'attributeChangedCallback',
    'disconnectedCallback',
  ].includes(lifecycle);
}
