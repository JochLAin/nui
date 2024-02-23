import { HTMLFieldElement, HTMLNuiFieldElement, input } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import styles from "./index.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<input type="text" part="input" />
`);

@input('nui-input')
export class HTMLNuiInputElement extends HTMLNuiFieldElement {
  readonly field: HTMLFieldElement;
  readonly shadowRoot!: ShadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.append(TEMPLATE.content.cloneNode(true));
    this.field = this.shadowRoot.querySelector('input')!;
  }
}
