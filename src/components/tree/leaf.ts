import { HTMLNuiElement, element } from "@nui-tools";
import styles from "./leaf.scss";

const template = `
<div part="content">
  <slot></slot>
</div>
`;

@element('nui-leaf', { parts: ['content'], template, styles })
export class HTMLNuiLeafElement extends HTMLNuiElement {
}
