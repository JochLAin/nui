import { HTMLNuiElement, attribute, element } from "@nui-tools";
import { HTMLNuiCollapseElement } from "@nui/collapse";
import styles from "./branch.scss";

const template = `
<nui-collapse exportparts="toggle:toggle, content:content, details:details">
  <slot name="toggle" slot="toggle">
    <slot></slot>
  </slot>
  <slot name="content" slot="content"></slot>
</nui-collapse>
`;

@element('nui-branch', { parts: ['content', 'details', 'toggle'], template, styles })
export class HTMLNuiBranchElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  readonly #collapse: HTMLNuiCollapseElement;

  @attribute()
  set open(value: boolean|null) {
    if (!this.#collapse) return;
    this.#collapse.open = value;
    this.dispatchEvent(new Event('nui-branch::toggle'));
  }

  constructor() {
    super();
    this.#collapse = this.shadowRoot.querySelector('nui-collapse')!;
    customElements.upgrade(this.#collapse);
  }

  initializedCallback() {
    this.#collapse.addEventListener('nui-collapse::toggle', () => {
      this.open = this.#collapse!.open;
    });
  }
}
