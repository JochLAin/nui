import { HTMLNuiElement, element, attribute } from "@nui-tools";
import styles from "./index.scss";

const template = ``;

@element('nui-caret', { template, styles })
export class HTMLNuiCaretElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;

  @attribute()
  open: boolean|null = null;
}
