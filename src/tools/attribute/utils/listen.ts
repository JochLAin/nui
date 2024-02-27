import type { AttributeListener, AttributeType } from "./define";

export function chainListeners<
  I extends HTMLElement = HTMLElement,
  F extends any = AttributeType,
>(
  listen?: AttributeListener<I, F>,
  _listen?: AttributeListener<I, F>,
): AttributeListener<I, F> {
  return function(this: I, value: F) {
    _listen?.call(this, value);
    listen?.call(this, value);
  }
}
