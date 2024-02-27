import * as tag from "./bundle";

declare global {
  interface HTMLElementTagNameMap {
    'nui-caret': tag.HTMLNuiCaretElement,
    'nui-collapse': tag.HTMLNuiCollapseElement,
    'nui-confirm': tag.HTMLNuiConfirmElement,
    'nui-dropdown': tag.HTMLNuiDropdownElement,
    'nui-field': tag.HTMLNuiFieldElement,
    'nui-input-text': tag.HTMLNuiInputTextElement,
    'nui-popin': tag.HTMLNuiPopinElement,
    'nui-row': tag.HTMLNuiRowElement,
    'nui-tree': tag.HTMLNuiTreeElement,
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'nui-caret': Partial<tag.HTMLNuiCaretElement>,
    'nui-collapse': Partial<tag.HTMLNuiCollapseElement>,
    'nui-confirm': Partial<tag.HTMLNuiConfirmElement>,
    'nui-dropdown': Partial<tag.HTMLNuiDropdownElement>,
    'nui-field': Partial<tag.HTMLNuiFieldElement>,
    'nui-input-text': Partial<tag.HTMLNuiInputTextElement>,
    'nui-popin': Partial<tag.HTMLNuiPopinElement>,
    'nui-row': Partial<tag.HTMLNuiRowElement>,
    'nui-tree': Partial<tag.HTMLNuiTreeElement>,
  }
}
