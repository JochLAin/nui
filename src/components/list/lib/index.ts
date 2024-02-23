import { HTMLNuiElement, element } from "@nui-tools/decorators";
import { getPrivatePackageName } from "@nui-tools/core/constants";
import styles from "./index.scss";

const EVENT_APPEND_CHILD = getPrivatePackageName('appended-child', 'nui-list');

const TEMPLATE_ROOT = document.createElement('template');
TEMPLATE_ROOT.innerHTML = `
<style>${styles}</style>
<slot></slot>
`;

const TEMPLATE_ITEM = document.createElement('template');
TEMPLATE_ITEM.innerHTML = `
<style>${styles}</style>
<li>
  <slot></slot>
</li>
`;

const TEMPLATE_LIST = document.createElement('template');
TEMPLATE_LIST.innerHTML = `
<style>${styles}</style>
<ul>
  <li>
    <slot></slot>    
  </li>
  <slot name="nui-list-item"></slot>
</ul>
`;

@element('nui-list')
export class HTMLNuiListElement extends HTMLNuiElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.appendChild(TEMPLATE_ROOT.content.cloneNode(true));
  }
}
