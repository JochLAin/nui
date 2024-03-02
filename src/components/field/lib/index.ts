import type { ElementConstructor } from "@nui-tools";
import { HTMLNuiField, attribute, element, field } from "@nui-tools";
import {
  HTMLNuiInputNumberElement,
  HTMLNuiInputTextElement,
} from "./inputs";

export type HTMLNuiInputElement = HTMLInputElement|HTMLTextAreaElement|HTMLNuiInputNumberElement|HTMLNuiInputTextElement;
export type HTMLNuiChoiceElement = HTMLSelectElement;
export type HTMLNuiFieldType = HTMLNuiInputElement|HTMLNuiChoiceElement;

export const FieldTags = {
  number: HTMLNuiInputNumberElement.tag,
  text: HTMLNuiInputTextElement.tag,
}

export function setupFieldInput(input: HTMLNuiFieldType, target?: HTMLNuiFieldElement) {
  input.disabled = target?.disabled || null;
  input.name = target?.name || null;
  input.required = target?.required || null;
  input.tabIndex = target?.tabIndex || -1;
  input.value = target?.value || null;

  if ('exportPartList' in input) {
    input.exportPartList.clear().forward();
  }

  return input;
}

export function createFieldInputNumber(target?: HTMLNuiFieldElement) {
  const input = document.createElement(HTMLNuiInputNumberElement.tag!) as HTMLNuiInputNumberElement;
  customElements.upgrade(input);
  return setupFieldInput(input, target);
}

export function createFieldInputText(target?: HTMLNuiFieldElement) {
  try {
    const input = document.createElement(HTMLNuiInputTextElement.tag!) as HTMLNuiInputTextElement;
    customElements.upgrade(input);
    return setupFieldInput(input, target);
  } catch (error: any) {
    console.log(target);
    throw error;
  }
}

export function getType(type: string|null): keyof typeof FieldTags {
  if (!Object.keys(FieldTags).includes(type || '')) {
    return 'text';
  }
  return type as keyof typeof FieldTags;
}

@field()
@element('nui-field', {
  parts: Array.from(new Set([
    ...HTMLNuiInputNumberElement.parts,
    ...HTMLNuiInputTextElement.parts,
  ]))
})
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
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.#setField(getType(this.type));
  }

  #createField(type: string): HTMLNuiFieldType {
    switch (type) {
      case 'number': return createFieldInputNumber(this);
      default: return createFieldInputText(this);
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
