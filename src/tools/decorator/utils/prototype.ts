export function getStaticValuesThroughPrototypes<T>(target: typeof HTMLElement, p: string|symbol): T[] {
  let proto: typeof HTMLElement = target;
  const values: T[] = [];

  while (true) {
    const name = p as (string|symbol) & keyof typeof proto;
    if (proto.hasOwnProperty(name)) values.push(proto[name] as T);
    const _proto = Object.getPrototypeOf(proto);
    if (_proto === HTMLElement) break;
    proto = _proto;
  }

  return values;
}
