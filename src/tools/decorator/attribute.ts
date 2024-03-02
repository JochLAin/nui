import type { AttributeDefinition, AttributeDictionary, AttributeListener, AttributeTransform, AttributeType, AttributeValue, ClassDecorator, HTMLElementConstructor, MethodDecorator, PropertyDecorator, PropertyDescriptor } from "@nui-tools";
import { chainDefinitions } from "@nui-tools/attribute";
import { decorateStatic } from "@nui-tools/decorator";

function buildDefinition<E extends HTMLElement, R extends AttributeValue = AttributeType>(
  def: Partial<AttributeDefinition<E, R>>|null,
  propertyName?: string|symbol,
  attributeName?: string,
  transform?: Function|null,
  listen?: Function|null,
  defaultValue?: R,
): AttributeDefinition<E, R> {
  propertyName ||= def?.propertyName;
  if (!propertyName) {
    throw new Error(`[@attribute] Invalid usage : propertyName is required.`);
  }

  return {
    propertyName: propertyName,
    attributeName: attributeName || def?.attributeName,
    transform: transform ? (transform as AttributeTransform<E, R>) : def?.transform,
    listen: listen ? (listen as AttributeListener<E, R>) : def?.listen,
    defaultValue: defaultValue !== undefined ? defaultValue : def?.defaultValue,
  };
}

export function getObservedAttributes<E extends typeof HTMLElement>(target: E, filteredAttribute?: string|symbol): (string|symbol)[] {
  if ('observedAttributes' in target) {
    if (filteredAttribute) {
      const attributes = target.observedAttributes as (string|symbol)[];
      return attributes.toSpliced(attributes.indexOf(filteredAttribute), 1);
    }
    return target.observedAttributes as (string|symbol)[];
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
    const observedAttributes = getObservedAttributes(target, definition.propertyName);
    const propertyAttributes = getPropertyAttributes(target);

    const parentDefinition = { ...propertyAttributes?.[definition.propertyName], propertyName: definition.propertyName };
    const mergedDefinition = chainDefinitions(definition, parentDefinition);

    if (mergedDefinition.listen) {
      observedAttributes.push(definition.propertyName);
    }

    Object.assign(target, {
      observedAttributes: observedAttributes,
      propertyAttributes: {
        ...propertyAttributes,
        [definition.propertyName]: mergedDefinition,
      },
    });
  });
}

function decorateInstance<
  E extends HTMLElement,
  R extends AttributeValue
>(
  target: E,
  propertyName: string|symbol,
  definition: Partial<AttributeDefinition<E, R>>|null,
  descriptor?: PropertyDescriptor<E, R>|null,
  transform?: AttributeTransform<E, R>|null,
  listen?: AttributeListener<E, R>|null,
  defaultValue?: R,
  attributeName?: string,
): void {
  if (typeof propertyName === 'symbol' && !attributeName) {
    throw new Error(`[Property @attribute] Invalid usage : propertyName must be a string or pass a attributeName, got symbol`);
  }

  if (descriptor?.get) {
    throw new Error(`[Method @attribute] Invalid usage : getter is not supported`);
  }

  if (descriptor?.set && listen) {
    throw new Error(`[Method @attribute] Invalid usage : can't use both descriptor.set and listener`);
  }

  return decorateClass(
    target.constructor as HTMLElementConstructor<E>,
    buildDefinition(
      definition,
      propertyName,
      transform,
      descriptor?.set || listen,
      descriptor?.value === undefined ? defaultValue : descriptor?.value,
      attributeName
    ),
  );
}

/******************************************************************************/
/*                              Class Decorator                               */
/******************************************************************************/
export function attribute<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  propertyName: string,
  transform?: AttributeTransform<InstanceType<C>, R>,
  listener?: AttributeListener<InstanceType<C>, R>,
  defaultValue?: R,
  attributeName?: string,
): ClassDecorator<C>;

export function attribute<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  propertyName: string,
  definition?: Omit<AttributeDefinition<InstanceType<C>, R>, 'propertyName'>,
): ClassDecorator<C>;

export function attribute<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  definition: AttributeDefinition<InstanceType<C>, R>,
): ClassDecorator<C>;

/******************************************************************************/
/*                              Called Decorator                              */
/******************************************************************************/
export function attribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  target: E,
  propertyName: string,
  transform?: AttributeTransform<E, R>,
  listener?: AttributeListener<E, R>,
  defaultValue?: R,
  attributeName?: string,
): void;

export function attribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  target: E,
  propertyName: string,
  definition?: Omit<AttributeDefinition<E, R>, 'propertyName'>,
): void;

export function attribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  target: E,
  definition: AttributeDefinition<E, R>,
): void;

/******************************************************************************/
/*                             Property Decorator                             */
/******************************************************************************/
export function attribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  transform?: AttributeTransform<E, R>|null,
  listener?: AttributeListener<E, R>,
  attributeName?: string,
): PropertyDecorator<E>;

export function attribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  definition: Omit<AttributeDefinition<E, R>, 'propertyName'|'defaultValue'>,
): PropertyDecorator<E>;

/******************************************************************************/
/*                              Method Decorator                              */
/******************************************************************************/
export function attribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  transform?: AttributeTransform<E, R>,
  attributeName?: string,
): MethodDecorator<E, R>;

export function attribute<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  definition: Omit<AttributeDefinition<E, R>, 'propertyName'|'listen'>,
): PropertyDecorator<E>;

/******************************************************************************/
/*                               Implementation                               */
/******************************************************************************/
export function attribute<
  C extends typeof HTMLElement,
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  arg1?: E|string|AttributeDefinition<InstanceType<C>, R>|Omit<AttributeDefinition<E, R>, 'propertyName'|'defaultValue'>|Omit<AttributeDefinition<E, R>, 'propertyName'|'listen'>|AttributeTransform<E, R>,
  arg2?: string|Omit<AttributeDefinition<InstanceType<C>, R>, 'propertyName'>|AttributeDefinition<E, R>|AttributeTransform<E|InstanceType<C>, R>,
  arg3?: string|Omit<AttributeDefinition<E, R>, 'propertyName'>|AttributeTransform<E, R>|AttributeListener<InstanceType<C>, R>,
  arg4?: R|AttributeListener<E, R>,
  arg5?: string|R,
  arg6?: string,
): void|ClassDecorator<C>|MethodDecorator<E, R>|PropertyDecorator<E> {
  if (typeof arg1 === 'string') {
    if (typeof arg2 === 'object') {
      if ('propertyName' in arg2) {
        throw new Error(`[Class @attribute] Invalid usage : definition must not have propertyName.`);
      }
      return (target: C) => decorateClass(target, buildDefinition(arg2, arg1));
    }

    if (arg2 !== undefined && typeof arg2 !== 'function') {
      throw new Error(`[Class @attribute] Invalid usage : transform must be a function, got ${typeof arg2}.`);
    }
    if (arg3 !== undefined && typeof arg3 !== 'function') {
      throw new Error(`[Class @attribute] Invalid usage : listener must be a function, got ${typeof arg3}.`);
    }
    if (arg4 !== undefined && typeof arg4 === 'function') {
      throw new Error(`[Class @attribute] Invalid usage : defaultValue cannot be a function, got ${typeof arg4}.`);
    }
    if (arg5 !== undefined && typeof arg5 !== 'string') {
      throw new Error(`[Class @attribute] Invalid usage : attributeName must be a string, got ${typeof arg5}.`);
    }
    if (arg6 !== undefined) {
      throw new Error(`[Property @attribute] Invalid usage : too many arguments`);
    }

    return (target: C) => decorateClass(target, buildDefinition({}, arg1, arg2, arg3, arg4, arg5 as string|undefined));
  }

  if (arg1 instanceof HTMLElement) {
    if (typeof arg2 === 'string') {
      if (typeof arg3 === 'object') {
        return decorateInstance(arg1, arg2, arg3);
      }

      if (arg3 !== undefined && typeof arg3 !== 'function') {
        throw new Error(`[Call @attribute] Invalid usage : transform must be a function, got ${typeof arg3}.`);
      }
      if (arg4 !== undefined && typeof arg4 !== 'function') {
        throw new Error(`[Call @attribute] Invalid usage : listener must be a function, got ${typeof arg4}.`);
      }
      if (arg5 !== undefined && typeof arg5 === 'function') {
        throw new Error(`[Call @attribute] Invalid usage : defaultValue must be a function, got ${typeof arg5}.`);
      }

      return decorateInstance(arg1, arg2, null, null, arg3 as AttributeTransform<E, R>, arg4 as AttributeListener<E, R>, arg5 as R|undefined, arg6);
    }

    if (typeof arg2 !== 'object') {
      throw new Error(`[Call @attribute] Invalid usage : definition must be an object.`);
    }

    if (!('propertyName' in arg2)) {
      throw new Error(`[Call @attribute] Invalid usage : definition must have propertyName.`);
    }

    return decorateInstance(arg1, arg2.propertyName, arg2);
  }

  if (arg1 !== null && typeof arg1 === 'object') {
    return function (target: C|E, propertyName?: string|symbol, descriptor?: PropertyDescriptor<E, R>) {
      if ('propertyName' in arg1) {
        if (typeof target !== 'function') {
          throw new Error(`[${descriptor ? 'Property' : 'Method'} @attribute] Invalid usage : propertyName is not supported.`);
        }
        return decorateClass(target, arg1);
      }

      if (typeof target === 'function') {
        throw new Error(`[Class @attribute] Invalid usage : propertyName is required.`);
      }
      if (propertyName === undefined) {
        throw new Error(`[${descriptor ? 'Property' : 'Method'} @attribute] Invalid usage : can't retrieve propertyName.`);
      }

      if (!descriptor?.set) {
        if ('defaultValue' in arg1) {
          throw new Error(`[Property @attribute] Invalid usage : defaultValue is not supported`);
        }
      } else {
        if ('listen' in arg1) {
          throw new Error(`[Method @attribute] Invalid usage : listener is not supported`);
        }
      }

      return decorateInstance(target, propertyName, arg1, descriptor);
    }
  }

  if (arg1 !== undefined && arg1 !== null && typeof arg1 !== 'function') {
    throw new Error(`[Property @attribute] Invalid usage : transform must be a function, got ${typeof arg1}.`);
  }

  return function (target: E, propertyName: string|symbol, descriptor?: PropertyDescriptor<E, R>) {
    if (descriptor?.get) {
      throw new Error(`[Property @attribute] Invalid usage : getter is not supported`);
    }

    if (descriptor?.set) {
      if (arg2 !== undefined && typeof arg2 === 'function') {
        throw new Error(`[Method @attribute] Invalid usage : listener is not supported`);
      }

      if (arg2 !== undefined && typeof arg2 !== 'string') {
        throw new Error(`[Method @attribute] Invalid usage : attributeName must be a string, got ${typeof arg2}`);
      }
      if (arg3 !== undefined) {
        throw new Error(`[Method @attribute] Invalid usage : too many arguments`);
      }

      return decorateInstance(target, propertyName, null, descriptor, arg1, null, undefined, arg2);
    }

    if (arg2 !== undefined && typeof arg2 !== 'function') {
      throw new Error(`[Property @attribute] Invalid usage : listener must be a function, got ${typeof arg2}`);
    }
    if (arg3 !== undefined && typeof arg3 !== 'string') {
      throw new Error(`[Property @attribute] Invalid usage : attributeName must be a string, got ${typeof arg3}`);
    }
    if (arg4 !== undefined) {
      throw new Error(`[Property @attribute] Invalid usage : too many arguments`);
    }

    return decorateInstance(target, propertyName, null, null, arg1, arg2, undefined, arg3);
  }
}
