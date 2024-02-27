import type { AttributeDefinition, ElementInterface, LifecycleMemory } from "@nui-tools";
import { DOMExportPartMap } from "@nui-tools/attribute";

export type HTMLNuiElementConstructor<T extends HTMLNuiElementInterface = HTMLNuiElementInterface> = typeof HTMLNuiElement & {
  new (...args: any[]): T;
  prototype: T;
};

export type HTMLNuiElementInterface = InstanceType<typeof HTMLNuiElement>;

export type HTMLNuiElementOptions = {
  init?: ShadowRootInit;
  template?: DocumentFragment|Node;
};

const LIFECYCLE_CALLBACKS: LifecycleMemory = {
  initializedCallback: [],
  connectedCallback: [],
  adoptedCallback: [],
  attributeChangedCallback: [],
  disconnectedCallback: []
};

export abstract class HTMLNuiElement extends HTMLElement implements ElementInterface {
  public static readonly lifecycleCallbacks: LifecycleMemory = LIFECYCLE_CALLBACKS;
  public static readonly observedAttributes: string[] = [];
  public static readonly propertyAttributes: Record<string, AttributeDefinition<HTMLNuiElement>> = {};
  public static readonly parts: string[] = [];
  public static readonly tag?: string = undefined;
  public static readonly template?: string = undefined;
  public static readonly styles?: string = undefined;
  public static getFragment = (): DocumentFragment|undefined => undefined;
  public static getNode = <T extends ChildNode>(): T|null => null;
  public exportPartList!: DOMExportPartMap;

  public constructor(opts?: HTMLNuiElementOptions) {
    super();

    if (opts?.template) {
      this.attachShadowFragment(opts.init, opts.template);
    } else {
      const { template, styles } = this.constructor as HTMLNuiElementConstructor;
      if (template || styles) {
        this.attachShadowFragment(opts?.init);
      }
    }
  }

  public adoptedCallback(): void {}
  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {}
  public connectedCallback(): void {}
  public disconnectedCallback(): void {}
  public initializedCallback(): void {}

  protected attachShadowFragment(opts?: ShadowRootInit, template?: DocumentFragment|Node): void {};
  protected shadowQuerySelector = <T extends Element>(selector: string): T|null => null;
  protected shadowQuerySelectorAll = <T extends Element>(selector: string): T[] => [];
  protected shadowSlotQuerySelector = <T extends Element>(name: string, selector: string, opts?: AssignedNodesOptions): T|null => null;
  protected shadowSlotQuerySelectorAll = <T extends Element>(name: string, selector: string, opts?: AssignedNodesOptions): T[] => [];
}
