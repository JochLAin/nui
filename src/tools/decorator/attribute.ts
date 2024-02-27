import type { AttributeDefinition, AttributeDictionary, AttributeListener, AttributeTransform, AttributeType, AttributeValue } from "@nui-tools/attribute";
import type { ClassDecorator, MethodDecorator, PropertyDecorator, PropertyDescriptor } from "@nui-tools/decorator";
import { chainDefinitions, chainListeners } from "@nui-tools/attribute";
import { decorateStatic } from "@nui-tools/decorator";

function buildDefinition<E extends HTMLElement, R extends AttributeValue = AttributeType>(def: Partial<AttributeDefinition<E, R>>, name?: string, transform?: Function, listen?: Function, defaultValue?: R): AttributeDefinition<E, R> {
  return {
    name: name || (def.name as string),
    transform: transform ? (transform as AttributeTransform<E, R>) : def.transform,
    listen: listen ? (listen as AttributeListener<E, R>) : def.listen,
    defaultValue: defaultValue !== undefined ? defaultValue : def.defaultValue,
  };
}

export function getObservedAttributes<E extends typeof HTMLElement>(target: E): string[] {
  if ('observedAttributes' in target) {
    return target.observedAttributes as string[];
  }
  return [];
}

export function getPropertyAttributes<E extends typeof HTMLElement>(target: E): AttributeDictionary<InstanceType<E>> {
  if ('propertyAttributes' in target) {
    return target.propertyAttributes as AttributeDictionary<InstanceType<E>>;
  }
  return {};
}

function decorateClass<E extends typeof HTMLElement, R extends AttributeValue = AttributeType>(target: E, definition: AttributeDefinition<InstanceType<E>, R>): void {
  return decorateStatic(target, (target) => {
    const observedAttributes = getObservedAttributes(target);
    const propertyAttributes = getPropertyAttributes(target);
    const mergedDefinition = chainDefinitions(definition, propertyAttributes?.[definition.name]);

    Object.assign(target, {
      observedAttributes: Array.from(new Set([...observedAttributes, definition.name])),
      propertyAttributes: {
        ...propertyAttributes,
        [definition.name]: mergedDefinition,
      },
    });
  });
}

function decorateInstance<E extends HTMLElement, R extends AttributeValue = AttributeType>(target: E, definition: AttributeDefinition<E, R>): void {
  // return decorateClass(target.constructor as HTMLElementConstructor<E>, definition);
  throw new Error('decorate property instance is not implemented yet.');
}

export function attribute<C extends typeof HTMLElement, R extends AttributeValue = AttributeType>(name: string, transform?: AttributeTransform<InstanceType<C>, R>, listener?: AttributeListener<InstanceType<C>, R>, defaultValue?: R): ClassDecorator<C>;
export function attribute<C extends typeof HTMLElement, R extends AttributeValue = AttributeType>(name: string, definition?: Omit<AttributeDefinition<InstanceType<C>, R>, 'name'>): ClassDecorator<C>;
export function attribute<C extends typeof HTMLElement, R extends AttributeValue = AttributeType>(definition: AttributeDefinition<InstanceType<C>, R>): ClassDecorator<C>;

export function attribute<E extends HTMLElement, R extends AttributeValue = AttributeType>(target: E, name: string, transform?: AttributeTransform<E, R>, listener?: AttributeListener<E, R>, defaultValue?: R): void;
export function attribute<E extends HTMLElement, R extends AttributeValue = AttributeType>(target: E, name: string, definition?: Omit<AttributeDefinition<E, R>, 'name'>): void;
export function attribute<E extends HTMLElement, R extends AttributeValue = AttributeType>(target: E, definition: AttributeDefinition<E, R>): void;

export function attribute<E extends HTMLElement, R extends AttributeValue = AttributeType>(transform?: AttributeTransform<E, R>, listener?: AttributeListener<E, R>): PropertyDecorator<E>;
export function attribute<E extends HTMLElement, R extends AttributeValue = AttributeType>(transform?: AttributeTransform<E, R>): MethodDecorator<E, R>;
export function attribute<
  C extends typeof HTMLElement,
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  arg1?: E|string|AttributeDefinition<InstanceType<C>, R>|AttributeTransform<E, R>,
  arg2?: string|Omit<AttributeDefinition<InstanceType<C>, R>, 'name'>|AttributeDefinition<E, R>|AttributeTransform<E|InstanceType<C>, R>,
  arg3?: Omit<AttributeDefinition<E, R>, 'name'>|AttributeTransform<E, R>|AttributeListener<InstanceType<C>, R>,
  arg4?: R|AttributeListener<E, R>,
  arg5?: R,
): void|ClassDecorator<C>|MethodDecorator<E, R>|PropertyDecorator<E> {
  if (typeof arg1 === 'string') {
    if (typeof arg2 === 'object') {
      if ('name' in arg2) throw new Error(`[Class @attribute] Invalid usage : definition must not have name.`);
      return (target: C) => decorateClass(target, buildDefinition(arg2, arg1));
    }
    if (arg2 !== undefined && typeof arg2 !== 'function') {
      throw new Error(`[Class @attribute] Invalid usage : transform must be a function.`);
    }
    if (arg3 !== undefined && typeof arg3 !== 'function') {
      throw new Error(`[Class @attribute] Invalid usage : listener must be a function.`);
    }
    if (arg3 !== undefined && typeof arg3 !== 'function') {
      throw new Error(`[Class @attribute] Invalid usage : listener must be a function.`);
    }
    if (arg4 !== undefined && typeof arg4 === 'function') {
      throw new Error(`[Class @attribute] Invalid usage : defaultValue cannot be a function.`);
    }

    return (target: C) => decorateClass(target, buildDefinition({}, arg1, arg2, arg3, arg4));
  }

  if (arg1 instanceof HTMLElement) {
    if (typeof arg2 === 'string') {
      if (typeof arg3 === 'object') {
        return decorateInstance(arg1, buildDefinition(arg3, arg2));
      }
      if (typeof arg3 === 'function') {
        if (typeof arg4 === 'function') {
          if (arg5 !== undefined && typeof arg5 === 'function') {
            throw new Error(`[Call @attribute] Invalid usage : defaultValue must be a function.`);
          }
          return decorateInstance(arg1, buildDefinition({}, arg2, arg3, arg4, arg5));
        }
        throw new Error(`[Call @attribute] Invalid usage : listener must be a function.`);
      }
      throw new Error(`[Call @attribute] Invalid usage : transform must be a function.`);
    }

    if (typeof arg2 === 'object') {
      if (!('name' in arg2)) throw new Error(`[Call @attribute] Invalid usage : definition must have name.`);
      return decorateInstance(arg1, arg2);
    }

    throw new Error(`[Call @attribute] Invalid usage : name must be a string.`);
  }

  if (typeof arg1 === 'object') {
    return function (target: C) {
      return decorateClass(target, arg1);
    }
  }

  if (arg1 !== undefined && typeof arg1 !== 'function') {
    throw new Error(`[Property @attribute] Invalid usage : transform must be a function, got ${typeof arg1}`);
  }
  if (arg2 !== undefined && typeof arg2 !== 'function') {
    throw new Error(`[Property @attribute] Invalid usage : listener must be a function, got ${typeof arg2}`);
  }
  if (arg3 !== undefined) {
    throw new Error(`[Property @attribute] Invalid usage : too many arguments`);
  }

  return function (target: E, name: string|symbol, descriptor?: PropertyDescriptor<E, R>) {
    if (typeof name === 'symbol') throw new Error(`[Property @attribute] Invalid usage : name must be a string, got symbol`);
    if (descriptor?.get) {
      console.log(target, descriptor);
      throw new Error(`[Property @attribute] Invalid usage : getter is not supported`);
    }
    const listen = descriptor?.set ? chainListeners<E, R>(arg2 as AttributeListener<E, R>, descriptor.set) : arg2;
    return decorateClass(target.constructor as C, buildDefinition({}, name, arg1, listen, descriptor?.value));
  }
}
