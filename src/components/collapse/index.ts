import { element, property } from "@nui-tools/element";
import { createTemplate } from "@nui-tools/helpers";
import styles from "!!raw-loader!sass-loader!./index.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<details part="nui-collapse__container">
  <summary part="nui-collapse__toggle">
    <slot name="nui-collapse__toggle"></slot>  
  </summary>
  <slot name="nui-collapse__content">
    <slot></slot>
  </slot>
</details>
`);

@element('nui-collapse')
export class HTMLNuiCollapseElement extends HTMLElement {
  @property()
  open!: boolean|null;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(TEMPLATE.content.cloneNode(true));

    const details = shadow.querySelector('details')!;
    details.open = !!this.open;
    details.addEventListener('toggle', () => {
      this.open = details.open || null;
      this.dispatchEvent(new Event('nui-collapse::toggle'));
    });
  }
}
