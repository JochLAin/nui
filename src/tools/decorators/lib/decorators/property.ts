export function property(): PropertyDecorator {
  return function decorate(obj: Object, name: string | symbol) {
    if (!(obj instanceof HTMLElement)) {
      throw new Error(`Expected an instance of HTMLElement, got ${obj.constructor.name}`);
    }
    if (typeof name !== 'string') {
      throw new Error(`Expected property name to be a string, got ${typeof name}`);
    }

    // @ts-ignore observedAttributes is not defined on HTMLElement
    obj.constructor.observedAttributes = Array.from(new Set([...(obj.constructor.observedAttributes || []), name]));
  }
}
