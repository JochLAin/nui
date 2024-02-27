export function decorateStatic<
  E extends typeof HTMLElement,
  T extends any
>(
  target: E,
  set: (target: E) => T,
): void {
  function closure(target: E): E {
    if (!target.name.match(/^HTMLNuiMixin/)) {
      return target;
    }

    const proto = Object.getPrototypeOf(target);
    if (proto === HTMLElement) {
      throw new Error('Element class must extends HTMLNuiElement or HTMLNuiFieldElement');
    }

    return closure(proto);
  }

  set(closure(target));
}
