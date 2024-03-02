import type { AttributeListener, AttributeType } from "./define";

export function chainListeners<
  I extends HTMLElement = HTMLElement,
  F extends any = AttributeType,
>(
  listen?: AttributeListener<I, F>|null,
  _listen?: AttributeListener<I, F>|null,
): AttributeListener<I, F>|undefined {
  if (!listen && !_listen) return undefined;
  return function(this: I, value: F) {
    _listen?.call(this, value);
    listen?.call(this, value);
  }
}
