
export type ExcludedConstructor<T extends Function> = Exclude<Omit<T, 'prototype'>, new(...args: any[]) => any>;

export type HTMLElementConstructor<E extends HTMLElement> = ExcludedConstructor<typeof HTMLElement> & {
  new(...args: any[]): E;
  prototype: E;
};
