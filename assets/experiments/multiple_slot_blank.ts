import { HTMLNuiElement, element } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";

const main = document.body.querySelector('main')!;

@element('nui-debug')
class HTMLNuiDebugElement extends HTMLNuiElement {
  static template = createTemplate(`<div><slot></slot></div><aside><slot></slot></aside>`);
  shadowRoot!: ShadowRoot;

  constructor() {
    super();
    const children = HTMLNuiDebugElement.template.content.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(children);
    const div = this.shadowRoot.querySelector('div')!;
    const aside = this.shadowRoot.querySelector('aside')!;

    this.shadowRoot.insertBefore(aside, div);
  }
}

main.innerHTML = `<nui-debug>Hello world</nui-debug>`;
