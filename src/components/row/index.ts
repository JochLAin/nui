import { HTMLNuiElement, element } from "@nui-tools";
import styles from "./index.scss";

const template = `
<slot></slot>
`;

@element('nui-row', { template, styles })
export class HTMLNuiRowElement extends HTMLNuiElement {
}
