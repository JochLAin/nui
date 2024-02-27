import { HTMLNuiElement, ElementOpts, element } from "@nui-tools";

const opts: ElementOpts = {
  properties: {
    label: {
      listen(value: string|null) {
        console.log(this, value);
      }
    }
  }
};

@element('nui-test', opts)
class HTMLNuiTestElement extends HTMLNuiElement {
  label!: string|null;

  initializedCallback() {
    console.log(this.label);
  }
}

document.querySelector('main')!.innerHTML = '<nui-test label="Libellé"></nui-test>';
