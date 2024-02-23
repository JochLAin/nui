import { HTMLNuiElement, element } from "@nui-tools/decorators";
import styles from "./item.scss";

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style>
<li>
  <slot></slot>
</li>
`;

@element('nui-list-item')
export class HTMLNuiListItemElement extends HTMLNuiElement {
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
