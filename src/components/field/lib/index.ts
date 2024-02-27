import type { ElementConstructor } from "@nui-tools";
import { HTMLNuiField, attribute, element, field } from "@nui-tools";
import {
  HTMLNuiInputNumberElement,
  HTMLNuiInputTextElement,
} from "./inputs";

export type HTMLNuiInputElement = HTMLNuiInputNumberElement|HTMLNuiInputTextElement;
// export type HTMLNuiFormChoiceElement = HTMLSelectElement|HTMLNuiChoiceElement;
// export type HTMLNuiFormFieldElement = HTMLNuiFormInputElement|HTMLNuiFormChoiceElement;
export type HTMLNuiFieldType = HTMLNuiInputElement;

const FieldTags = {
  number: HTMLNuiInputNumberElement.tag,
  text: HTMLNuiInputTextElement.tag,
}

function setupInput(input: HTMLNuiInputElement, target?: HTMLNuiFieldElement) {
  input.disabled = target?.disabled || null;
  input.name = target?.name || null;
  input.required = target?.required || null;
  input.value = target?.value || null;
  input.exportPartList.clear().forward();

  return input;
}

function createInputNumber(target?: HTMLNuiFieldElement) {
  const input = document.createElement(HTMLNuiInputNumberElement.tag!) as HTMLNuiInputNumberElement;
  customElements.upgrade(input);
  return setupInput(input, target);
}

function createInputText(target?: HTMLNuiFieldElement) {
  const input = document.createElement(HTMLNuiInputTextElement.tag!) as HTMLNuiInputTextElement;
  customElements.upgrade(input);
  return setupInput(input, target);
}

function getType(type: string|null): keyof typeof FieldTags {
  if (!Object.keys(FieldTags).includes(type || '')) {
    return 'text';
  }
  return type as keyof typeof FieldTags;
}

@field()
@element('nui-field', { parts: ['field', 'input', 'select', 'textarea'] })
export class HTMLNuiFieldElement extends HTMLNuiField {
  public readonly shadowRoot!: ShadowRoot;
  #field!: HTMLNuiFieldType;

  @attribute()
  public set type(value: string|null) {
    this.#setField(getType(value));
  }

  @attribute()
  public set value(value: string|null) {
    this.#field.value = value;
    this.setFormValue(value);
  }

  public constructor() {
    super();
    this.attachShadowFragment();
    this.#setField(getType(this.type));
  }

  #createField(type: string): HTMLNuiFieldType {
    switch (type) {
      case 'number': return createInputNumber(this);
      default: return createInputText(this);
    }
  }

  #setField(type: keyof typeof FieldTags) {
    if (this.#field && (this.#field.constructor as ElementConstructor).tag === FieldTags[type]) {
      return;
    }

    const previousField = this.#field;
    const newField = this.#createField(type);
    this.attachField();
    if (previousField) previousField.replaceWith(newField);
    else this.shadowRoot.append(newField);
    this.attachField(newField);
    this.#field = newField;
  }
}
