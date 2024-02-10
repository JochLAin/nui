import * as tag from "@nui/bundle";

declare global {
  interface HTMLElementDeprecatedTagNameMap {
    'nui-collapse': tag.HTMLNuiCollapseElement,
    'nui-li': tag.HTMLNuiListItemElement,
    'nui-ol': tag.HTMLNuiListNumberElement,
    'nui-row': tag.HTMLNuiRowElement,
    'nui-tree': tag.HTMLNuiTreeElement,
    'nui-ul': tag.HTMLNuiListMarkElement,
  }
  interface HTMLElementTagNameMap {
    'nui-collapse': tag.HTMLNuiCollapseElement,
    'nui-li': tag.HTMLNuiListItemElement,
    'nui-ol': tag.HTMLNuiListNumberElement,
    'nui-row': tag.HTMLNuiRowElement,
    'nui-tree': tag.HTMLNuiTreeElement,
    'nui-ul': tag.HTMLNuiListMarkElement,
  }
}
