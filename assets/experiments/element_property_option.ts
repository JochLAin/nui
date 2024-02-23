import { HTMLNuiElement, ElementOpts, element } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";

const opts: ElementOpts = {
  properties: {
    label: {
      set(element, value: string|null) {
        console.log(element, value);
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
