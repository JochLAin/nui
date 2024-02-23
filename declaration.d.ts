import * as tag from "@nui/bundle";

declare global {
  interface HTMLElementDeprecatedTagNameMap {
    'nui-caret': tag.HTMLNuiCaretElement,
    'nui-collapse': tag.HTMLNuiCollapseElement,
    'nui-confirm': tag.HTMLNuiConfirmElement,
    'nui-dropdown': tag.HTMLNuiDropdownElement,
    'nui-input': tag.HTMLNuiInputElement,
    'nui-popin': tag.HTMLNuiPopinElement,
    'nui-row': tag.HTMLNuiRowElement,
    'nui-tree': tag.HTMLNuiTreeElement,
  }
  interface HTMLElementTagNameMap {
    'nui-caret': tag.HTMLNuiCaretElement,
    'nui-collapse': tag.HTMLNuiCollapseElement,
    'nui-confirm': tag.HTMLNuiConfirmElement,
    'nui-dropdown': tag.HTMLNuiDropdownElement,
    'nui-input': tag.HTMLNuiInputElement,
    'nui-popin': tag.HTMLNuiPopinElement,
    'nui-row': tag.HTMLNuiRowElement,
    'nui-tree': tag.HTMLNuiTreeElement,
  }
}
