export type RenameClassOptions = {
  prefix?: string,
  name?: string,
};

export function renameClass<E extends typeof HTMLElement>(targetClass: E, opts?: RenameClassOptions): E {
  const name = opts?.name || targetClass.name;
  let className = name.slice(name.indexOf('HTML'));
  if (!className) throw new Error('Element class name must starts with "HTML" prefix');
  className = className.replace(/^Mixin/, '');
  className = className.replace(/Element$/, '');
  className = `Mixin${opts?.prefix || ''}${className}Element`;

  // Object.defineProperty(targetClass, 'name', { value: className });
  // Object.defineProperty(targetClass.prototype, Symbol.toStringTag, {
  //   configurable: false,
  //   value: className,
  //   writable: false,
  // });

  // @ts-ignore mixin classes constructor tuple arguments
  return ({ [className]: class extends targetClass {} })[className] as E;
}
