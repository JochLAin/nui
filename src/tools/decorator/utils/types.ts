type FunctionType<Args extends any[], Return extends any> = (...args: Args) => Return;

export type ClassDecorator<T extends Function> = FunctionType<[T], T|void>
export type MethodDecorator<T extends object, V extends any> = FunctionType<[T, string|symbol, TypedPropertyDescriptor<V>], void|TypedPropertyDescriptor<V>>;
export type ParameterDecorator<T extends object> = FunctionType<[T, string|symbol|undefined, number], void>;
export type PropertyDecorator<T extends object> = FunctionType<[T, string|symbol], void>;

export type PropertyDescriptor<E extends object, T> = {
  configurable?: boolean;
  enumerable?: boolean;
  value?: T;
  writable?: boolean;
  get?(this: E): T;
  set?(this: E, value: T): void;
};
