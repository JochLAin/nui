import { HTMLNuiField, attribute, element, field } from "@nui-tools";
import styles from "./text.scss";

const template = `<input type="text" part="field input" />`;

@element('nui-input-text', { parts: ['field', 'input'], template, styles })
@field()
export class HTMLNuiInputTextElement extends HTMLNuiField {
  public readonly shadowRoot!: ShadowRoot;
  readonly #field: HTMLInputElement;

  @attribute()
  public set value(value: string|null) {
    this.#field.value = value || '';
    this.setFormValue(value);
  }

  constructor() {
    super({ init: { mode: 'open', delegatesFocus: true } });
    this.#field = this.shadowRoot.querySelector<HTMLInputElement>('input')!;
    this.attachField(this.#field);
  }

  public initializedCallback = () => {
    this.#field.addEventListener('change', (evt) => {
      if (!this.#field.value) this.value = null;
      else this.value = this.#field.value;
      this.dispatchEvent(new Event(evt.type, evt));
    });
  }
}
