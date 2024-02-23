function clean(value: string|null) {
  return serialize(parse(value)).replace(/,,/, ',').replace(/(^,|,$)/, '');
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

  add(ref: string, target: string) {
    this.#attribute = clean(`${this.#attribute},${ref}:${target}`);
    return this;
  }

  contains(ref: string, target: string) {
    return !!this.#attribute?.match(new RegExp(`${ref}\s*:\s*${target}`));
  }

  remove(ref: string, target: string) {
    this.#attribute = clean(this.#attribute.replace(new RegExp(`${ref}\s*:\s*${target}`, 'g'), ''));
    return this;
  }

  toggle(ref: string, target: string, forced?: boolean) {
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
    return clean(this.#element.getAttribute('exportparts') || '');
  }
}
