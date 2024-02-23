import { HTMLNuiElement, element } from "@nui-tools/decorators";
import styles from "./number.scss";

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style>
<ol>
  <slot></slot>
</ol>
`;

@element('nui-list-number')
export class HTMLNuiListNumberElement extends HTMLNuiElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.appendChild(template.content.cloneNode(true));
  }
}

@element('nui-ol')
export class HTMLNuiListOrderedElement extends HTMLNuiListNumberElement {
}
