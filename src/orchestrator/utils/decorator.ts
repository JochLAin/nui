type Fn<R = any, A extends any[] = any[]> = (...args: A) => R;
export type DecoratorClass<T extends Fn> = (target: T) => void;
export type DecoratorMethod<T extends object, V = undefined> = (target: T, property: string|symbol, descriptor: PropertyDescriptor<T, V>) => void | TypedPropertyDescriptor<V>;
export type DecoratorParameter<T extends object> = (target: T, property: string|symbol|undefined, idx: number) => void;
export type DecoratorProperty<T extends object> = (target: T, property: string|symbol) => void;
export type Decorator<T extends object | Fn, V = undefined> = T extends Fn ? DecoratorClass<T> : DecoratorMethod<T, V> | DecoratorProperty<T> | DecoratorParameter<T>;
export type DecoratorScope = 'class' | 'method' | 'property' | 'parameter';
export type DecoratorVerifier<R> = boolean | string | Fn<string | void, [R, string]>;
export type DecoratorArgument<R> = [string, R, DecoratorVerifier<R>];
export type DecoratorArgumentValue<T extends DecoratorArgument<any>> = T extends DecoratorArgument<infer I> ? I : never;

export type PropertyDescriptor<E extends object, T = undefined> = {
  configurable?: boolean;
  enumerable?: boolean;
  value?: T;
  writable?: boolean;
  get?(this: E): T;
  set?(this: E, value: T): void;
};


export class DecoratorError extends Error {
  constructor(name: string, scope: DecoratorScope, message: string) {
    message = `[@${name}: ${scope}] ${message}`;
    super(message);
  }
}

export function verifyOptions<D extends Decorator<object | Fn>, O extends Record<string, any>>(name: string, scope: DecoratorScope, value: O, opts: { [K in keyof O]?: DecoratorVerifier<any> }, callback: (object: O) => D): D {
  Object.entries(opts).forEach(([key, value]) => {
    const test = opts[key];
    
  })
  return callback(value);
}

export function verifyArguments<D extends Decorator<object | Fn>, A extends DecoratorArgument<any>[]>(name: string, scope: DecoratorScope, args: A, callback: (...args: DecoratorArgumentValue<A[number]>) => D): D {
  for (let idx = 0; idx < args.length; idx++) {
    const [property, value, test] = args[idx];

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

  return callback(...args.map(([_, value]) => value) as DecoratorArgumentValue<A[number]>);
}
