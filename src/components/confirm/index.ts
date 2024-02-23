import { HTMLNuiElement, element, property } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import _ from "@nui-tools/i18n";
import styles from "./index.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<dialog part="dialog">
    <div class="content" part="content">
        <slot name="message">
            <slot></slot>
        </slot>
        <footer part="actions">
          <button type="button" part="cancel">
              <slot name="cancel">${_('No')}</slot>
          </button>
          <button type="button" part="valid">
              <slot name="valid">${_('Yes')}</slot>
          </button>
        </footer>
    </div>
</dialog>
`);

@element('nui-confirm')
export class HTMLNuiConfirmElement extends HTMLNuiElement {
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
    const btnCancel = this.shadowRoot.querySelector<HTMLButtonElement>('button[part="cancel"]');
    const btnValid = this.shadowRoot.querySelector<HTMLButtonElement>('button[part="valid"]');

    btnCancel!.addEventListener('click', () => {
      this.dispatchEvent(new Event('nui-confirm::cancel'));
      this.open = false;
    });

    btnValid!.addEventListener('click', () => {
      this.dispatchEvent(new Event('nui-confirm::valid'));
      this.open = false;
    });
  }
}
