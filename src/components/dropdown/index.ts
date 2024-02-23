import { HTMLNuiElement, element, property } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import styles from "./index.scss";
import { HTMLNuiCollapseElement } from "@nui/collapse";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<nui-collapse exportparts="caret:caret, toggle:toggle, content:content, wrapper:wrapper">
  <slot name="toggle" slot="toggle"></slot>
  <slot name="content" slot="content">
    <slot></slot>
  </slot>
</nui-collapse>
`);

@element('nui-dropdown')
export class HTMLNuiDropdownElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  #collapse!: HTMLNuiCollapseElement;

  @property()
  set open(value: boolean|null) {
    if (!this.#collapse) return;
    this.#collapse.open = value;
    this.dispatchEvent(new Event('nui-dropdown::toggle'));
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(TEMPLATE.content.cloneNode(true));
  }

  initializedCallback() {
    this.#collapse = this.shadowRoot.querySelector('nui-collapse')!;
    customElements.upgrade(this.#collapse);
    this.#collapse.addEventListener('nui-collapse::toggle', () => {
      this.open = this.#collapse!.open;
    });
  }
}
