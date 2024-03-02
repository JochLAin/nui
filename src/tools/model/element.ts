import type { AttributeDefinition, ElementInterface, LifecycleMemory } from "@nui-tools";
import { DOMExportPartMap } from "@nui-tools/attribute";
import { LIFECYCLE_CALLBACKS } from "@nui-tools/lifecycle";

export type HTMLNuiElementConstructor<T extends HTMLNuiElementInterface = HTMLNuiElementInterface> = typeof HTMLNuiElement & {
  new (...args: any[]): T;
  prototype: T;
};

export type HTMLNuiElementInterface = InstanceType<typeof HTMLNuiElement>;

export type HTMLNuiElementOptions = {
  init?: ShadowRootInit;
  template?: DocumentFragment|Node;
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

  public adoptedCallback(): void {}
  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {}
  public connectedCallback(): void {}
  public disconnectedCallback(): void {}
  public initializedCallback(): void {}

  protected attachShadowFragment(template?: DocumentFragment|Node, opts?: ShadowRootInit): void {};
  protected shadowQuerySelector = <T extends Element>(selector: string): T|null => null;
  protected shadowQuerySelectorAll = <T extends Element>(selector: string): T[] => [];
  protected shadowSlotQuerySelector = <T extends Element>(name: string, selector: string, opts?: AssignedNodesOptions): T|null => null;
  protected shadowSlotQuerySelectorAll = <T extends Element>(name: string, selector: string, opts?: AssignedNodesOptions): T[] => [];
}
