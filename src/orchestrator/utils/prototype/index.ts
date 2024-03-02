export * from "./callParentMethod";
export * from "./renameClass";

export type HTMLElementConstructor<E extends HTMLElement> = typeof HTMLElement & {
  new(...args: any[]): E;
  prototype: E;
};

export type HTMLElementClass<E extends HTMLElement|typeof HTMLElement = HTMLElement> = E extends HTMLElement ? HTMLElementConstructor<E> : E;
export type HTMLElementInstance<E extends HTMLElement|typeof HTMLElement = typeof HTMLElement> = E extends typeof HTMLElement ? InstanceType<E> : E;
