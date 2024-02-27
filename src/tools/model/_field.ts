import type { HTMLNuiElementOptions, Validation } from "@nui-tools";
import { attribute, lifecycle } from "@nui-tools/decorator";
import { HTMLNuiElement } from "./element";

export type HTMLNativeFieldElement = HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement;
export type HTMLFieldElement = HTMLNativeFieldElement|HTMLNuiFieldElement;
export type HTMLNuiFormState = string|File|FormData;

export type HTMLNuiFieldConstructor<T extends HTMLFieldInterface = HTMLFieldInterface> = typeof HTMLNuiFieldElement & {
  new (field: HTMLFieldElement, opts?: HTMLNuiElementOptions): T;
  prototype: T;
};

export type HTMLFieldInterface = InstanceType<typeof HTMLNuiFieldElement>;

function forwardDisabled(value: boolean|null, field?: HTMLFieldElement) {
  if (!field) return
  field.toggleAttribute('disabled', value || false);
}

function forwardRequired(value: boolean|null, field?: HTMLFieldElement) {
  if (!field) return
  field.toggleAttribute('required', value || false);
}

function forwardPattern(value: string|null, field?: HTMLFieldElement) {
  if (!field) return
  if (value) field.setAttribute('pattern', value);
  else field.removeAttribute('pattern');
}

// @todo adapt value to field type
function forwardValue(value: boolean|number|string|null, field?: HTMLFieldElement) {
  if (!field) return;
  if (typeof value === 'boolean') value = value ? '' : null;
  if (typeof value === 'number') field.setAttribute('value', String(value));
  if (typeof value === 'string') field.setAttribute('value', value);
  else field.toggleAttribute('value', !!value);
}

export abstract class HTMLNuiFieldElement extends HTMLNuiElement {
  public static readonly formAssociated = true;
  public static readonly validationList: Validation[] = [];

  readonly #internals: ElementInternals;
  #defaultValue: boolean|number|string|null = null;
  #field?: HTMLFieldElement;

  @attribute()
  public floating!: boolean|null;

  @attribute()
  public name!: string|null;

  constructor(field: HTMLFieldElement, opts?: HTMLNuiElementOptions) {
    super(opts);
    this.#internals = this.attachInternals();
    this.#field = field;

    lifecycle(this, 'initializedCallback', () => {
      this.#observe();
    });

    lifecycle(this, 'connectedCallback', () => {
      this.#defaultValue = this.value;
      this.#setValue();
      this.#setValidity();
    });

    lifecycle(this, 'attributeChangedCallback', () => {
      this.#setValidity();
    });
  }

  public attachField(field?: HTMLFieldElement) {
    this.#field = field;
    this.#observe();
    this.#setValue();
    this.#setValidity();
  }

  public checkValidity(): boolean {
    return this.#internals.checkValidity();
  }

  public reportValidity(): void {
    this.#internals.reportValidity();
  }

  public willValidate(): boolean {
    return this.#internals.willValidate;
  }

  #observe() {
    if (!this.#field) return;
    forwardDisabled(this.disabled, this.#field);
    forwardRequired(this.required, this.#field);
    forwardPattern(this.pattern, this.#field);
    forwardValue(this.value, this.#field);
  }

  #setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void {
    // Custom validation
    if (flags || message) {
      this.#internals.setValidity(flags, message, anchor || this.#field);
      return;
    }

    // Static validation
    const { validationList } = this.constructor as HTMLNuiFieldConstructor;
    for (let idx = 0; idx < validationList.length; idx++) {
      // @todo-next
      const result = validationList[idx].call(this, document.createElement('input'));
      if (typeof result === 'string') {
        this.#internals.setValidity({ customError: true }, result, anchor || this.#field);
        return;
      } else if (result) {
        this.#internals.setValidity(...result);
        return;
      }
    }

    if (!this.#field) {
      // No field, no error
      this.#internals.setValidity({});
    } else {
      // Default validation
      this.#internals.setValidity(this.#field.validity, this.#field.validationMessage, this.#field);
    }
  }

  #setValue(value?: HTMLNuiFormState|boolean|number|null, state?: HTMLNuiFormState|null): void {
    if (value === undefined) value = this.value;
    if (value === undefined) value = null;

    if (typeof value === 'boolean') value = value ? 1 : 0;
    if (typeof value === 'number') value = String(value);

    if (!state) state = value;

    if (null === value || typeof value === 'string') {
      forwardValue(value, this.#field);
    }

    this.#internals.setFormValue(value, state);
  }

  @attribute()
  public set disabled(value: boolean|null) {
    forwardDisabled(value, this.#field);
  }

  @attribute()
  public set pattern(value: string|null) {
    forwardPattern(value, this.#field);
  }

  @attribute()
  public set required(value: boolean|null) {
    forwardRequired(value, this.#field);
  }

  @attribute()
  public set value(value: boolean|number|string|null) {
    this.#setValue(value);
  }

  protected get form(): HTMLFormElement|null {
    return this.#internals.form;
  }

  public get validationMessage(): string {
    return this.#internals.validationMessage;
  }

  public get validity(): ValidityState {
    return this.#internals.validity;
  }
}

// function setLabel(field: HTMLFieldElement, value: string|null, label?: HTMLLabelElement|null) {
//   if (!value) {
//     label?.remove();
//     return;
//   }
//
//   if (!label) {
//     label = document.createElement('label');
//     label.setAttribute('part', 'label');
//     field.before(label);
//   }
//
//   label.textContent = value;
// }
