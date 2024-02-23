import { element, HTMLNuiElement } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";

const main = document.body.querySelector('main')!;

@element('nui-child')
class HTMLNuiChildElement extends HTMLNuiElement {
  static template = createTemplate(`<slot></slot>`);

  constructor() {
    super();
    const children = HTMLNuiChildElement.template.content.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(children);
  }
}

@element('nui-parent')
class HTMLNuiParentElement extends HTMLNuiElement {
  static template = createTemplate(`<nui-child><slot></slot></nui-child>`);

  constructor() {
    super();
    const children = HTMLNuiParentElement.template.content.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(children);
  }
}

@element('nui-root')
class HTMLNuiRootElement extends HTMLNuiElement {
  static template = createTemplate(`<nui-parent><slot></slot></nui-parent>`);

  constructor() {
    super();
    const children = HTMLNuiRootElement.template.content.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(children);
  }
}

main.innerHTML = `<nui-root>Hello world</nui-root>`;
