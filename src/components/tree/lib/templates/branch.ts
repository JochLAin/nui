import { createTemplate } from "@nui-tools/helpers";
import styles from "!!raw-loader!sass-loader!./branch.scss";

export const TEMPLATE_BRANCH = createTemplate(`
<style>${styles}</style>
<nui-collapse part="nui-tree__fork">
  <slot name="nui-tree__toggle" slot="nui-collapse__toggle">
    <slot></slot>
  </slot>
  <div slot="nui-collapse__content" part="nui-tree__branch">
    <slot name="nui-tree__branch"></slot>
  </div>
</nui-collapse>
`);
