import type { FieldType } from "./field";
import { decorateStatic } from "@nui-tools/decorator";

export type Validation<T extends HTMLElement = HTMLElement, F extends FieldType = FieldType> = (this: T, field?: F) => [ValidityStateFlags, string]|string|undefined|void;
type ValidationDescriptor = TypedPropertyDescriptor<Validation>;

export function getValidationList<E extends typeof HTMLElement>(target: E): Validation[] {
  if ('validationList' in target) {
    return target.validationList as Validation[];
  }
  return [];
}

function validationClass<T extends typeof HTMLElement>(validation: Validation) {
  return function decorate<E extends T>(targetClass: E): void {
    decorateStatic(targetClass, (target) => {
      const list = getValidationList(target);
      Object.assign(target, {
        validationList: [...list, validation],
      });
    })
  }
}

function validationMethod<T extends typeof HTMLElement>() {
  return function decorate<E extends T>(target: E, p: string|symbol, descriptor: ValidationDescriptor): void {
    const property = p as (string|symbol) & keyof E;
    if (typeof target[property] !== 'function' || !descriptor) throw new Error('Validation target must be a method.');
    validationClass(target[property] as Validation)(target);
  }
}

export function validation<T extends typeof HTMLElement>(validation: Validation): ReturnType<typeof validationClass<T>>;
export function validation<T extends typeof HTMLElement>(): ReturnType<typeof validationMethod<T>>;
export function validation<T extends typeof HTMLElement>(validation?: Validation) {
  return function decorate<E extends T>(target: E, property?: string|symbol, descriptor?: ValidationDescriptor) {
    if (!validation && property && descriptor) {
      validationMethod<E>()(target, property, descriptor);
    } else if (validation && !property) {
      validationClass<E>(validation)(target);
    }
  }
}
