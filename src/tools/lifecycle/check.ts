export function checkLifecycle(lifecycle: string): lifecycle is string {
  return [
    'initializedCallback',
    'connectedCallback',
    'adoptedCallback',
    'attributeChangedCallback',
    'disconnectedCallback',
  ].includes(lifecycle);
}
