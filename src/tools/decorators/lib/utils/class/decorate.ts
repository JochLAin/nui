type Constructor<T = any> = {
  new (...args: any[]): T;
  prototype: T;
}

export function decorateClass<T extends Constructor>(classPrefix: string, className: string, fromClass: T): T {
  if (!className.match(/^Decorated/)) {
    className = `${classPrefix}${className}`;
  }

  return ({
    // @ts-ignore mixin classes constructor arguments
    [className]: class extends fromClass {
      static get [Symbol.toStringTag]() {
        return className;
      }
    }
  })[className] as unknown as T;
}
