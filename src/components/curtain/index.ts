import { HTMLNuiElement, attribute, element } from "@nui-tools";
import styles from "./index.scss";

@element('nui-curtain', {
  parts: ['dialog', 'close', 'content'],
  template: `
<dialog part="dialog">
  <slot name="close">
    <button type="button" part="close">&times;</button>
  </slot>
  <div class="content" part="content">
    <slot></slot>
  </div>
</dialog>
`,
  styles
})
export class HTMLNuiCurtainElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  readonly #dialog: HTMLDialogElement;

  @attribute((value) => value === 'right' ? value : 'left')
  side!: 'left'|'right';

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
