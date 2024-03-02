import { HTMLNuiElement, attribute, element } from "@nui-tools";
import styles from "./index.scss";
import { HTMLNuiCollapseElement } from "@nui/collapse";

@element('nui-dropdown', {
  parts: ['caret', 'toggle', 'content', 'wrapper'],
  template: `
<nui-collapse>
  <slot name="toggle" slot="toggle"></slot>
  <slot name="content" slot="content">
    <slot></slot>
  </slot>
</nui-collapse>
`,
  styles
})
export class HTMLNuiDropdownElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  readonly #collapse!: HTMLNuiCollapseElement;

  @attribute()
  set open(value: boolean|null) {
    if (!this.#collapse) return;
    this.#collapse.open = value;
    this.dispatchEvent(new Event('nui-dropdown::toggle'));
  }

  constructor() {
    super();
    this.#collapse = this.shadowRoot.querySelector('nui-collapse')!;
    customElements.upgrade(this.#collapse);
    this.#collapse.exportPartList.forward();
  }

  initializedCallback() {
    this.#collapse.addEventListener('nui-collapse::toggle', () => {
      this.open = this.#collapse!.open;
    });
  }
}
