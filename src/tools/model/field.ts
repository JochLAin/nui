import { FieldInterface, FieldType, FormState, Validation } from "@nui-tools";
import { HTMLNuiElement } from "./element";

const DEFAULT_VALIDITY: ValidityState = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: true,
  valueMissing: false,
};

export class HTMLNuiField extends HTMLNuiElement implements FieldInterface {
  public static readonly formAssociated: boolean = true;
  public static readonly validationList: Validation[] = [];

  public disabled: boolean|null = false;
  public name: string|null = '';
  public required: boolean|null = false;
  public validationMessage: string = '';
  public validity: ValidityState = DEFAULT_VALIDITY;

  protected form: HTMLFormElement|null = null;
  protected labels: NodeListOf<HTMLLabelElement>|null = null;

  public checkValidity(): boolean { return true; }
  public reportValidity(): void {}
  public setValidity(field: FieldType, flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
  public setValidity(flags: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
  public setValidity(message: string, anchor?: HTMLElement): void;
  public setValidity(arg1: string|FieldType|ValidityStateFlags, arg2?: string|HTMLElement|ValidityStateFlags, arg3?: string|HTMLElement, arg4?: HTMLElement): void {}
  public willValidate(): boolean { return true; }

  protected attachField(field?: FieldType): void {}
  protected setFormValue(value: FormState, state?: null|string|File|FormData): void {}
}
