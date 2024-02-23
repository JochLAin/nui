import { DOMExportPartMap } from './attributes/exportPartList';

export type StaticElementClass = {
  observedAttributes?: string[];
}

export type ElementClass<T extends HTMLElement = HTMLElement> = StaticElementClass & {
  new (): ElementInstance<T>;
  prototype: ElementInstance<T>;
}

export type ElementInstance<T extends HTMLElement = HTMLElement> = T & {
  readonly shadowRoot: ShadowRoot;
  readonly exportPartList: DOMExportPartMap;
  initializedCallback?: () => void;
  connectedCallback?: () => void;
  attributeChangedCallback?: (name: string, oldValue: string, newValue: string) => void;
  disconnectedCallback?: () => void;
}

export abstract class HTMLNuiElement extends HTMLElement implements ElementInstance {
  readonly shadowRoot!: ShadowRoot;
  readonly exportPartList!: DOMExportPartMap;

  constructor() {
    super();

    Object.defineProperty(this, 'exportPartList', {
      configurable: false,
      get: () => new DOMExportPartMap(this),
      set: () => {},
    });
  }
}
