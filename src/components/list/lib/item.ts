import { element } from "@nui-tools/element";
import styles from "!!raw-loader!sass-loader!./item.scss";

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style>
<li>
  <slot></slot>
</li>
`;

@element('nui-list-item')
export class HTMLNuiListItemElement extends HTMLElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.appendChild(template.content.cloneNode(true));
  }
}

@element('nui-li')
export class HTMLNuiLIElement extends HTMLNuiListItemElement {
}
