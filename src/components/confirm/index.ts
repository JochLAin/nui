import { HTMLNuiElement, attribute, element } from "@nui-tools";
import _ from "@nui-tools/i18n";

@element('nui-confirm', {
  parts: ['dialog', 'content', 'actions', 'cancel', 'valid'],
  template: `
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
`,
})
export class HTMLNuiConfirmElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  #dialog!: HTMLDialogElement;

  @attribute()
  set open(value: boolean|null) {
    if (value) {
      this.#dialog.showModal();
    } else {
      this.#dialog.close();
    }
  }

  initializedCallback() {
    this.#dialog = this.shadowRoot.querySelector<HTMLDialogElement>('dialog[part~="dialog"]')!;

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
