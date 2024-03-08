export type ClassConstructor<T = any, A extends any[] = []> = { new(...args: A): T, prototype: T };

export type DecoratorClass<T extends ClassConstructor> = (target: T) => void | T;
export type DecoratorMethod<T extends object, V = undefined> = (target: T, property: string|symbol, descriptor: PropertyDescriptor<T, V>) => void | TypedPropertyDescriptor<V>;
export type DecoratorParameter<T extends object> = (target: T, property: string|symbol|undefined, idx: number) => void;
export type DecoratorProperty<T extends object> = (target: T, property: string|symbol) => void;
export type Decorator<T extends object | ClassConstructor, V = undefined> = T extends ClassConstructor ? DecoratorClass<T> : DecoratorMethod<T, V> | DecoratorProperty<T> | DecoratorParameter<T>;
export type DecoratorScope = 'class' | 'method' | 'property' | 'parameter';

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
