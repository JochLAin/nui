import { HTMLNuiElement, element } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import styles from "./leaf.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<div part="content">
  <slot></slot>
</div>
`);

@element('nui-leaf')
export class HTMLNuiLeafElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(TEMPLATE.content.cloneNode(true));
  }
}
