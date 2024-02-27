import type { LifecycleRecord } from "@nui-tools/lifecycle";
import { assignMultipleLifecycles } from "@nui-tools/lifecycle";

export type DecoratorClassRename = {
  prefix?: string,
};

type ElementDecoratorOpts<Instance extends HTMLElement> = DecoratorClassRename & {
  listeners?: Partial<LifecycleRecord<Instance>>
}

export function renameClass<E extends typeof HTMLElement>(targetClass: E, opts?: DecoratorClassRename): E {
  let className = targetClass.name.slice(targetClass.name.indexOf('HTML'));
  if (!className) throw new Error('Element class name must starts with "HTML" prefix');
  className = className.replace(/^HTML(Nui)?/, '');
  className = className.replace(/Element$/, '');
  className = `HTMLMixinNui${opts?.prefix || ''}${className}Element`;

  Object.defineProperty(targetClass, 'name', { value: className });
  Object.defineProperty(targetClass.prototype, Symbol.toStringTag, {
    configurable: false,
    value: className,
    writable: false,
  });

  return targetClass;
}

export function decorateClass<
  Constructor extends typeof HTMLElement,
  Instance extends HTMLElement & InstanceType<Constructor>,
>(
  targetClass: Constructor,
  opts: ElementDecoratorOpts<Instance> = {}
): Constructor {
  // @ts-ignore mixin classes constructor arguments tuple not work with ConstructorParameters<Constructor>
  class Mixin extends targetClass {
    constructor(...args: ConstructorParameters<Constructor>) {
      // @ts-ignore mixin classes constructor arguments tuple not work with ConstructorParameters<Constructor>
      super(...args);
      if (opts.listeners) {
        assignMultipleLifecycles(
          this.constructor as Constructor,
          opts.listeners
        );
      }
    }
  }

  renameClass<Constructor>(Mixin, opts);
  return Mixin;
}
