import { HTMLNuiCollapseElement } from "@nui/collapse";
import { HTMLNuiElement, element, property } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import styles from "./branch.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<nui-collapse exportparts="caret:caret, toggle:toggle, content:content, details:details">
  <slot name="toggle" slot="toggle">
    <slot></slot>
  </slot>
  <slot name="content" slot="content"></slot>
</nui-collapse>
`);

@element('nui-branch')
export class HTMLNuiBranchElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  #collapse!: HTMLNuiCollapseElement;

  @property()
  set open(value: boolean|null) {
    if (!this.#collapse) return;
    this.#collapse.open = value;
    this.dispatchEvent(new Event('nui-branch::toggle'));
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(TEMPLATE.content.cloneNode(true));
    this.#collapse = this.shadowRoot.querySelector('nui-collapse')!;
    customElements.upgrade(this.#collapse);
  }

  initializedCallback() {
    this.#collapse.addEventListener('nui-collapse::toggle', () => {
      this.open = this.#collapse!.open;
    });
  }
}
