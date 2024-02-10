import { element, property } from "@nui-tools/element";
import styles from "!!raw-loader!sass-loader!./index.scss";

const TEMPLATE_LEAF = document.createElement('template');
TEMPLATE_LEAF.innerHTML = `
<style>${styles}</style>
<slot></slot>
`;

const TEMPLATE_BRANCH = document.createElement('template');
TEMPLATE_BRANCH.innerHTML = `
<style>${styles}</style>
<details part="tree">
    <summary part="toggle">
        <slot></slot>
    </summary>
    <div part="branches">
        <slot name="branch"></slot>    
    </div>
</details>
`;


@element('nui-menu')
export default class HTMLMenuElement extends HTMLElement {
  readonly #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
  }
}
