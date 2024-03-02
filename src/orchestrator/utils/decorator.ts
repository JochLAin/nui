type Fn<R = any, A extends any[] = any[]> = (...args: A) => R;
export type DecoratorClass<T extends Fn> = (target: T) => void;
export type DecoratorMethod<T extends object, V = undefined> = (target: T, property: string|symbol, descriptor: PropertyDescriptor<T, V>) => void | TypedPropertyDescriptor<V>;
export type DecoratorParameter<T extends object> = (target: T, property: string|symbol|undefined, idx: number) => void;
export type DecoratorProperty<T extends object> = (target: T, property: string|symbol) => void;
export type Decorator<T extends object | Fn, V = undefined> = T extends Fn ? DecoratorClass<T> : DecoratorMethod<T, V> | DecoratorProperty<T> | DecoratorParameter<T>;
export type DecoratorVerifier<R> = boolean | string | Fn<string | void, [R, string]>;
export type DecoratorVerifyArgument<R> = [string, R, DecoratorVerifier<R>];

export type PropertyDescriptor<E extends object, T = undefined> = {
  configurable?: boolean;
  enumerable?: boolean;
  value?: T;
  writable?: boolean;
  get?(this: E): T;
  set?(this: E, value: T): void;
};

export type DecoratorScope = 'class' | 'method' | 'property' | 'parameter';

export class DecoratorError extends Error {
  constructor(name: string, scope: DecoratorScope, message: string) {
    message = `[@${name}: ${scope}] ${message}`;
    super(message);
  }
}

export function verifyOptions<R extends Decorator<object | Fn>>(name: string, scope: DecoratorScope, value: object, opts: Record<string, Decorator>, callback: () => R): R {

}

export function verifyArguments<A extends DecoratorVerifyArgument<any>[], R extends Decorator<object | Fn>>(name: string, scope: DecoratorScope, args: A, callback: (...args: any[]) => R, prefix?: string): R {
  for (let idx = 0; idx < args.length; idx++) {
    const [prop, value, test] = args[idx];
    const property = prefix ? `${prefix}.${prop}` : prop;

    if (test === true && value === undefined) {
      throw new DecoratorError(name, scope, `Missing argument: ${property}`);
    }

    if (test === false && value !== undefined) {
      throw new DecoratorError(name, scope, `Forbidden argument: ${property}`);
    }

    if (typeof test === 'string' && typeof value !== test) {
      throw new DecoratorError(name, scope, `Invalid argument: ${property}, expected ${test}, got ${typeof value}`);
    }

    if (typeof test === 'function') {
      const message = test(value, property);
      if (message) {
        throw new DecoratorError(name, scope, message);
      }
    }
  }

  return callback(...args.map(([_, value]) => value));
}
