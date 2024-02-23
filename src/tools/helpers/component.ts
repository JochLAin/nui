export function createTemplate(html: string) {
  const template = document.createElement('template');
  template.innerHTML = html.trim().replace(/>[\n ] *</g, '><');
  return template;
}

export function getTemplateChild<T extends HTMLElement>(template: HTMLTemplateElement): T {
  return template.content.cloneNode(true).firstChild as T;
}
