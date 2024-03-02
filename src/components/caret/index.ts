import { HTMLNuiElement, element, attribute } from "@nui-tools";
import styles from "./index.scss";

@element('nui-caret', { styles })
export class HTMLNuiCaretElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;

  @attribute()
  open: boolean|null = null;
}
