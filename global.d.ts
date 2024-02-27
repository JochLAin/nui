import * as tag from "@nui";

declare module '*.md' {
  const content: any;
  export default content;
}

declare global {
  interface HTMLElementDeprecatedTagNameMap {
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
