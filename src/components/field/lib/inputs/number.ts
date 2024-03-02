import { HTMLNuiField, attribute, element, field } from "@nui-tools";
import styles from "./number.scss";

// function validateNumber(field: Field): ReturnType<HTMLNuiValidation> {
//   const value = field.value;
//   if (typeof value !== 'string') return;
//   if (value.match(/^[+-]?(\d+|\d*(.\d+))(e[+-]?\d+)?$/)) return;
//   return [{ patternMismatch: true }, 'This value must be a valid number'];
// }

@field()
@element('nui-input-number', {
  delegatesFocus: true,
  parts: ['field', 'input'],
  template: `<input type="number" part="field input" />`,
  styles
})
export class HTMLNuiInputNumberElement extends HTMLNuiField {
  public readonly shadowRoot!: ShadowRoot;
  #field!: HTMLInputElement;

  @attribute()
  public set value(value: number|null) {
    this.#field.value = String(value);
    this.setFormValue(value);
  }

  public initializedCallback() {
    this.#field = this.shadowRoot.querySelector<HTMLInputElement>('input')!;
    this.attachField(this.#field);

    this.#field.addEventListener('change', (evt) => {
      if (!this.#field.value) this.value = null;
      else this.value = Number(this.#field.value);
      this.dispatchEvent(new Event(evt.type, evt));
    });
  }
}
