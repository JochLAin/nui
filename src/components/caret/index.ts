import { HTMLNuiElement, element, property } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import styles from "./index.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
`);

@element('nui-caret')
export class HTMLNuiCaretElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;

  @property()
  open: boolean|null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }
}
