import { HTMLNuiElement, attribute, element } from "@nui-tools";
import styles from "./index.scss";

const template = `
<dialog part="dialog">
    <slot name="close">
      <button type="button" part="close">&times;</button>
    </slot>
    <div class="content" part="content">
        <slot></slot>
    </div>
</dialog>
`;

@element('nui-popin', { parts: ['close', 'content', 'dialog'], template, styles })
export class HTMLNuiPopinElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  readonly #dialog: HTMLDialogElement;

  @attribute()
  set open(value: boolean|null) {
    if (value) {
      this.#dialog.showModal();
    } else {
      this.#dialog.close();
    }
  }

  constructor() {
    super();
    this.#dialog = this.shadowRoot.querySelector<HTMLDialogElement>('dialog[part~="dialog"]')!;
  }

  initializedCallback() {
    const btnClose = this.shadowRoot.querySelector<HTMLButtonElement>('button[part~="close"]');
    btnClose?.addEventListener('click', () => this.open = false);
  }
}
