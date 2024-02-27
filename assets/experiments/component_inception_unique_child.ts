import { element, HTMLNuiElement } from "@nui-tools";

const main = document.body.querySelector('main')!;

@element('nui-child', { template: `<slot></slot>` })
class HTMLNuiChildElement extends HTMLNuiElement {
}

@element('nui-parent', { template: `<nui-child><slot></slot></nui-child>` })
class HTMLNuiParentElement extends HTMLNuiElement {
}

@element('nui-root', { template: `<nui-parent><slot></slot></nui-parent>` })
class HTMLNuiRootElement extends HTMLNuiElement {
}

main.innerHTML = `<nui-root>Hello world</nui-root>`;
