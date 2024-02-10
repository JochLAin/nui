import { createTemplate } from "@nui-tools/helpers";
import styles from "!!raw-loader!sass-loader!./leaf.scss";

export const TEMPLATE_LEAF = createTemplate(`
<style>${styles}</style>
<div part="nui-tree__content nui-tree__leaf">
  <slot></slot>
</div>
`);
