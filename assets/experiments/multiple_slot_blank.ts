import { HTMLNuiElement, element } from "@nui-tools";

const main = document.body.querySelector('main')!;

@element('nui-debug', { template: `<div><slot></slot></div><aside><slot></slot></aside>` })
class HTMLNuiDebugElement extends HTMLNuiElement {
  shadowRoot!: ShadowRoot;

  constructor() {
    super();
    const div = this.shadowRoot.querySelector('div')!;
    const aside = this.shadowRoot.querySelector('aside')!;
    this.shadowRoot.insertBefore(aside, div);
  }
}

main.innerHTML = `<nui-debug>Hello world</nui-debug>`;
