import type { ClassDecorator, HTMLElementClass } from "../utils";
import { renameClass, setupMetadata } from "../utils";
import * as lifecycle from "./lifecycle";

export type Component = Partial<ShadowRootInit & {
  conceal: boolean,
  parts: string[],
  tag: string,
  template: string,
  styles: string,
}>;

const PARTS = setupMetadata<string[]>(Symbol('component::part'), { collection: true });
export function getParts(target: HTMLElement|HTMLElementClass): string[] {
  return PARTS.recover(target.constructor as HTMLElementClass).reduce((accu, value) => [...accu, ...value], []);
}

const TEMPLATE = setupMetadata<string>(Symbol('component::template'));
export function getTemplate(target: HTMLElement|HTMLElementClass): string | undefined {
  return TEMPLATE.recover(target.constructor as HTMLElementClass) || undefined;
}

const STYLE = setupMetadata<string>(Symbol('component::style'), { collection: true });
export function getStyle(target: HTMLElement|HTMLElementClass): string {
  return STYLE.recover(target.constructor as HTMLElementClass).join('');
}

function buildComponent(html?: string, styles?: string): DocumentFragment {
  const fragment = buildFragment(html);
  if (styles) {
    const style = document.createElement('style');
    style.textContent = styles;
    fragment.prepend(style);
  }

  return fragment;
}

function buildFragment(html?: string): DocumentFragment {
  let fragment: DocumentFragment;

  if (html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    fragment = template.content;
  } else {
    fragment = document.createDocumentFragment();
  }

  return fragment;
}

function buildNode<T extends ChildNode>(html?: string): T|null {
  if (!html) return null;
  return buildFragment(html).firstChild as T;
}

function buildObservedAttributes<T extends typeof HTMLElement>(target: T): string[] {
  // const observedAttributes = getStaticValuesThroughPrototypes<string[]>(target, 'observedAttributes');
  // return observedAttributesvedAttributes.reduce((accu, value) => [...accu, ...value], []);
  return [];
}

export function render<T extends HTMLElement>(target: T, opts?: Partial<ShadowRootInit>) {
  const shadow = target.attachShadow({ mode: 'open', ...opts });

  const template = getTemplate(target.constructor as HTMLElementClass);
  const styles = getStyle(target.constructor as HTMLElementClass);
  if (!template && !styles) return;

  const fragment = buildComponent(template, styles);
  shadow.append(fragment);
}

export function decorate<C extends HTMLElementClass>(tag: string, opts: Omit<Component, 'tag'>): ClassDecorator<C>;
export function decorate<C extends HTMLElementClass>(opts: Component): ClassDecorator<C>;
export function decorate<C extends HTMLElementClass>(arg1: string|Component, arg2?: Omit<Component, 'tag'>): ClassDecorator<C> {
  const opts: Component = typeof arg1 === 'string' ? { tag: arg1, ...arg2 } : arg1;
  return function <CC extends C>(targetClass: CC): CC {
    if (typeof targetClass !== 'function') throw new Error(`[@component] Invalid target, expected a class, got ${typeof targetClass}`);
    if (opts?.template) TEMPLATE.store(targetClass, opts.template);
    if (opts?.styles) STYLE.store(targetClass, opts.styles);
    if (opts?.parts) PARTS.store(targetClass, opts.parts.reduce((accu: string[], value) => [...accu, ...value.split(' ')], []));

    // @ts-ignore mixin classes constructor tuple arguments
    class MixinComponent extends targetClass {
      constructor(...args: ConstructorParameters<typeof targetClass>) {
        // @ts-ignore mixin classes constructor tuple arguments
        super(...args);
        this.initializedCallback();
      }

      initializedCallback() {
        if (!opts?.conceal) render(this, opts);
        lifecycle.callParent(targetClass, this, 'initializedCallback');
        lifecycle.call(this, 'initializedCallback');
      }

      connectedCallback() {
        lifecycle.callParent(targetClass, this, 'connectedCallback');
        lifecycle.call(this, 'connectedCallback');
      }

      adoptedCallback() {
        lifecycle.callParent(targetClass, this, 'adoptedCallback');
        lifecycle.call(this, 'adoptedCallback');
      }

      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        lifecycle.callParent(targetClass, this, 'attributeChangedCallback', name, oldValue, newValue);
        lifecycle.call(this, 'attributeChangedCallback', name, oldValue, newValue);
      }

      disconnectedCallback() {
        lifecycle.callParent(targetClass, this, 'disconnectedCallback');
        lifecycle.call(this, 'disconnectedCallback');
      }
    }

    return renameClass<CC>(MixinComponent, {
      name: targetClass.name,
      prefix: 'Component',
    });
  }
}
