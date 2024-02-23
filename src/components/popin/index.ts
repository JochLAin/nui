import { HTMLNuiElement, element, property } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import styles from "./index.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<dialog part="dialog">
    <slot name="close">
      <button type="button" part="close">&times;</button>
    </slot>
    <div class="content" part="content">
        <slot></slot>
    </div>
</dialog>
`);

@element('nui-popin')
export class HTMLNuiPopinElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  readonly #dialog: HTMLDialogElement;

  @property()
  set open(value: boolean|null) {
    if (value) {
      this.#dialog.showModal();
    } else {
      this.#dialog.close();
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(TEMPLATE.content.cloneNode(true));
    this.#dialog = this.shadowRoot.querySelector<HTMLDialogElement>('dialog[part~="dialog"]')!;
  }

  initializedCallback() {
    const btnClose = this.shadowRoot.querySelector<HTMLButtonElement>('button[part~="close"]');
    btnClose?.addEventListener('click', () => this.open = false);
  }
}
