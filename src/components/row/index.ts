import { HTMLNuiElement, element } from "@nui-tools/decorators";
import styles from "./index.scss";

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style>
<slot></slot>
`;

@element('nui-row')
export class HTMLNuiRowElement extends HTMLNuiElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}
