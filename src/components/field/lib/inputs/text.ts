import { HTMLNuiField, attribute, element, field } from "@nui-tools";
import styles from "./text.scss";

@field()
@element('nui-input-text', {
  delegatesFocus: true,
  parts: ['field', 'input'],
  template: `<input type="text" part="field input" />`,
  styles
})
export class HTMLNuiInputTextElement extends HTMLNuiField {
  public readonly shadowRoot!: ShadowRoot;
  #field!: HTMLInputElement;

  @attribute()
  public set value(value: string|null) {
    this.#field.value = value || '';
    this.setFormValue(value);
  }

  public initializedCallback = () => {
    this.#field = this.shadowRoot.querySelector<HTMLInputElement>('input')!;
    this.attachField(this.#field);

    this.#field.addEventListener('change', (evt) => {
      if (!this.#field.value) this.value = null;
      else this.value = this.#field.value;
      this.dispatchEvent(new Event(evt.type, evt));
    });
  }
}
