import { element } from "@nui-tools/element";
import styles from "!!raw-loader!sass-loader!./index.scss";

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style>
<slot></slot>
`;

@element('nui-row')
export class HTMLNuiRowElement extends HTMLElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.appendChild(template.content.cloneNode(true));
  }
}
