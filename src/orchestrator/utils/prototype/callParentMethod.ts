export function callParentMethod<T extends typeof HTMLElement, E extends HTMLElement, K extends string | symbol, A extends any[], R extends any>(targetClass: T, target: E, name: K, ...args:  A): void | R {
  if (name in targetClass.prototype) {
    const property = name as keyof typeof targetClass.prototype;
    const callback = targetClass.prototype[property] as ((...args: A) => R)|undefined;
    if (typeof callback === 'function') {
      return callback.call(target, ...args);
    }
  }
}
