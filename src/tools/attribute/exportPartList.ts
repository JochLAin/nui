function format(value?: string|null) {
  if (!value) return '';

  value = value.replace(/(^,|,$)/, '');
  value = serialize(parse(value));
  value = value.replace(/,,/, ',');

  return value.replace(/(^,|,$)/, '');
}

function parse(value: string|null): Map<string, Set<string>> {
  const results = new Map();
  const parts = (value || '').split(',').map((part) => part.split(':').map((p) => p.trim()));
  for (let idx = 0; idx < parts.length; idx++) {
    const [key, value] = parts[idx];
    if (!results.get(key)) results.set(key, new Set());
    results.get(key).add(value);
  }
  return results;
}

function serialize(parts: Map<string, Set<string>>) {
  const results: string[] = [];
  parts.forEach((values, key) => {
    values.forEach((value) => {
      results.push(`${key}:${value}`);
    });
  });
  return results.join(', ');
}

export class DOMExportPartMap {
  #element: HTMLElement;

  constructor(element: HTMLElement) {
    this.#element = element;
  }

  add(ref: string, target: string = ref) {
    this.#attribute = format(`${this.#attribute},${ref}:${target}`);
    return this;
  }

  clear() {
    this.#attribute = '';
    return this;
  }

  contains(ref: string, target: string = ref) {
    return !!this.#attribute?.match(new RegExp(`${ref}\s*:\s*${target}`));
  }

  forward() {
    const parts: string[] = 'parts' in this.#element.constructor
      ? this.#element.constructor.parts as string[]
      : []
    ;

    for (let idx = 0; idx < parts.length; idx++) {
      this.add(parts[idx], parts[idx]);
    }

    return this;
  }

  remove(ref: string, target: string = ref) {
    this.#attribute = format(this.#attribute.replace(new RegExp(`${ref}\s*:\s*${target}`, 'g'), ''));
    return this;
  }

  toggle(ref: string, target: string = ref, forced?: boolean) {
    if (this.contains(ref, target) || forced === false) {
      this.remove(ref, target);
    } else if (!this.contains(ref, target) || forced === true) {
      this.add(ref, target);
    }
    return this;
  }

  set #attribute(value: string) {
    this.#element.setAttribute('exportparts', value);
  }

  get #attribute(): string {
    return format(this.#element.getAttribute('exportparts'));
  }
}
