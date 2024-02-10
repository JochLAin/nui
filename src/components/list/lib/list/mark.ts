import { element } from "@nui-tools/element";
import styles from "!!raw-loader!sass-loader!./mark.scss";

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style>
<ul>
  <slot></slot>
</ul>
`;

@element('nui-list-mark')
export class HTMLNuiListMarkElement extends HTMLElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.appendChild(template.content.cloneNode(true));
  }
}

@element('nui-ul')
export class HTMLNuiListUnorderedElement extends HTMLNuiListMarkElement {
}
