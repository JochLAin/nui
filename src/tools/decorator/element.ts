import type { AttributeDefinition, AttributeDictionary, AttributeValue } from "@nui-tools/attribute";
import type { ClassDecorator } from "@nui-tools/decorator";
import { LifecycleKey, LifecycleRecord, LifecycleMemory } from "@nui-tools/lifecycle";
import { DOMExportPartMap, callLifecycle, defineAttribute, lifecycle, renameClass, transformAttributeValue } from "@nui-tools";
import { getPropertyAttributes } from "./attribute";
import { getStaticValuesThroughPrototypes } from "./utils";

export type ElementClass<C extends typeof HTMLElement = typeof HTMLElement> = Omit<C, 'prototype'> & ElementConstructor<InstanceType<C>>;

export type ElementConstructor<I extends HTMLElement = HTMLElement> = {
  new(...args: any[]): ElementInterface & I;
  lifecycleCallback?: LifecycleMemory;
  observedAttributes?: string[];
  parts?: string[];
  propertyAttributes?: AttributeDictionary<ElementInterface & I>;
  prototype: ElementInterface & I;
  tag?: string;
  template?: string;
  styles?: string;

  getFragment(): DocumentFragment;
  getNode<C extends ChildNode>(): C|null;
}

export interface ElementInterface extends HTMLElement {
  initializedCallback?(): void;
  connectedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
  adoptedCallback?(): void;
  disconnectedCallback?(): void;

  // attachShadowFragment(opts?: ShadowRootInit, template?: DocumentFragment|Node): void;
  // shadowQuerySelector(selector: string): Element|null;
  // shadowQuerySelectorAll(selector: string): Element[];
  // shadowSlotQuerySelector(name: string, selector: string, opts?: AssignedNodesOptions): Element|null;
  // shadowSlotQuerySelectorAll(name: string, selector: string, opts?: AssignedNodesOptions): Element[];
}

export type ElementOpts<T extends HTMLElement = HTMLElement> = {
  parts?: string[],
  properties?: Record<string, Omit<AttributeDefinition<T, AttributeValue>, 'name'>|null>,
  template?: string,
  styles?: string,
}

function buildFragment(html?: string, styles?: string): DocumentFragment {
  let fragment: DocumentFragment;

  if (html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    fragment = template.content;
  } else {
    fragment = document.createDocumentFragment();
  }

  if (styles) {
    const style = document.createElement('style');
    style.textContent = styles;
    fragment.prepend(style);
  }

  return fragment;
}

function buildNode<T extends ChildNode>(html?: string): T|null {
  if (!html) return null;
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.cloneNode(true).firstChild as T;
}

function buildObservedAttributes<T extends typeof HTMLElement>(target: T): string[] {
  const observedAttributes = getStaticValuesThroughPrototypes<string[]>(target, 'observedAttributes');
  return observedAttributes.reduce((accu, value) => [...accu, ...value], []);
}

function buildParts<T extends typeof HTMLElement>(target: T, addon: string[] = []): string[] {
  addon = addon.reduce<string[]>((accu, value) => [...accu, ...value.split(' ')], []);
  const parts = getStaticValuesThroughPrototypes<string[]>(target, 'parts');
  return parts.reduce((accu, value) => [...accu, ...value], addon);
}

function buildPropertyAttributes<T extends typeof HTMLElement>(target: T): AttributeDictionary<InstanceType<typeof target>> {
  const attributes = getStaticValuesThroughPrototypes<AttributeDictionary<InstanceType<typeof target>>>(target, 'propertyAttributes');
  return attributes.reduce((accu, value) => ({ ...accu, ...value }), {});
}

export function callParentLifeCycle<
  T extends typeof HTMLElement,
  E extends HTMLElement,
  K extends LifecycleKey<E>,
>(
  targetClass: T,
  target: E,
  name: K,
  ...args:  Parameters<LifecycleRecord<E>[K]>
): void {
  if (name in targetClass.prototype) {
    // @ts-ignore @todo-types
    const callback = targetClass.prototype[name];
    if (typeof callback === 'function') {
      callback.call(target, ...args);
    }
  }
}

export function element<T extends typeof HTMLElement = typeof HTMLElement>(tag?: string, opts?: ElementOpts<InstanceType<T>>): ClassDecorator<T> {
  return function <C extends T>(targetClass: C) {
    if (tag && typeof window !== 'undefined') {
      const element = customElements.get(tag);
      if (element?.prototype instanceof targetClass) return element as C;
      if (element) throw new Error(`The element ${tag} is already defined as a different class.`);
    }

    const template = opts?.template?.trim().replace(/>\s+</g, '><');
    const styles = opts?.styles?.trim();

    // @ts-ignore mixin classes constructor arguments tuple not work with ConstructorParameters<Constructor>
    class MixinElement extends targetClass implements ElementInterface {
      public static readonly observedAttributes: string[] = buildObservedAttributes(targetClass);
      public static readonly parts = buildParts(targetClass, opts?.parts);
      public static readonly propertyAttributes = buildPropertyAttributes(targetClass);
      public static readonly tag = tag;
      public static readonly template = template;
      public static readonly styles = styles;
      public static getFragment = () => buildFragment(template, styles);
      public static getNode = <T extends ChildNode>() => buildNode<T>()

      constructor(...args: ConstructorParameters<typeof targetClass>) {
        // @ts-ignore mixin classes constructor arguments tuple not work with ConstructorParameters<Constructor>
        super(...args);

        Object.defineProperty(this, 'exportPartList', {
          configurable: false,
          writable: false,
          value: new DOMExportPartMap(this),
        });

        // Attach property to attribute
        const propertyAttributes = getPropertyAttributes(targetClass);
        const keys = Object.keys(propertyAttributes);
        for (let idx = 0; idx < keys.length; idx++) {
          const { transform, listen, defaultValue } = propertyAttributes[keys[idx]];
          defineAttribute(this as InstanceType<T>, keys[idx], transform, listen, defaultValue);
        }

        // Attach properties option to attribute
        if (opts?.properties) {
          const props = Object.keys(opts.properties);
          for (let idx = 0; idx < props.length; idx++) {
            const { transform, listen, defaultValue } = opts.properties[props[idx]] || {};
            defineAttribute(this as InstanceType<T>, props[idx], transform, listen, defaultValue);
          }
        }

        this.initializedCallback();
      }

      initializedCallback() {
        callParentLifeCycle(targetClass, this, 'initializedCallback');
        callLifecycle(this, 'initializedCallback');
      }

      connectedCallback() {
        callParentLifeCycle(targetClass, this, 'connectedCallback');
        callLifecycle(this, 'connectedCallback');
      }

      adoptedCallback() {
        callParentLifeCycle(targetClass, this, 'adoptedCallback');
        callLifecycle(this, 'adoptedCallback');
      }

      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        callParentLifeCycle(targetClass, this, 'attributeChangedCallback', name, oldValue, newValue);
        callLifecycle(this, 'attributeChangedCallback', name, oldValue, newValue);
      }

      disconnectedCallback() {
        callParentLifeCycle(targetClass, this, 'disconnectedCallback');
        callLifecycle(this, 'disconnectedCallback');
      }

      protected attachShadowFragment(opts?: ShadowRootInit, template?: DocumentFragment|Node) {
        const fragment = template || (this.constructor as ElementConstructor<InstanceType<C>>).getFragment();
        const shadow = this.attachShadow(opts || { mode: 'open' });
        if (fragment) shadow.appendChild(fragment);
        return shadow;
      }

      protected shadowQuerySelector<T extends Element = Element>(selector: string): T|null {
        const element = this.shadowRoot?.querySelector<T>(selector) || null;
        if (element?.tagName.match(/^nui-/)) customElements.upgrade(element);
        return element;
      }

      protected shadowQuerySelectorAll<T extends Element = Element>(selector: string): T[] {
        const list = Array.from(this.shadowRoot?.querySelectorAll<T>(selector) || []);
        return list?.map((element) => {
          if (element?.tagName.match(/-/)) {
            customElements.upgrade(element);
          }
          return element as T;
        });
      }

      protected shadowSlotQuerySelector<T extends Element = Element>(slotName: string, selector: string, opts?: AssignedNodesOptions): T|null {
        const slot = this.shadowRoot?.querySelector(slotName) as HTMLSlotElement;
        const children = slot?.assignedElements(opts) || [];
        return children.find(child => child.matches(selector)) as T;
      }

      protected shadowSlotQuerySelectorAll<T extends Element = Element>(slotName: string, selector: string, opts?: AssignedNodesOptions): T[] {
        const slot = this.shadowRoot?.querySelector(slotName) as HTMLSlotElement;
        const children = slot?.assignedElements(opts) || [];
        return children.filter(child => child.matches(selector)).map((child) => {
          if (child?.tagName.match(/-/)) {
            customElements.upgrade(child);
          }
          return child as T;
        });
      }

      @lifecycle()
      [Symbol('attributeChangedCallback')](name: string, _: string, newValue: string) {
        const propertyAttributes = getPropertyAttributes(targetClass);
        if (propertyAttributes[name]) {
          let value = transformAttributeValue(name, newValue);
          value = propertyAttributes[name].transform?.call(this as InstanceType<T>, value) || value;
          propertyAttributes[name].listen?.call(this as InstanceType<T>, value);
        }
      }
    }

    renameClass<C>(MixinElement);
    if (tag && typeof window !== 'undefined') {
      customElements.define(tag, MixinElement);
    }

    return MixinElement;
  }
}
