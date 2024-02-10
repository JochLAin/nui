export function createTemplate(html: string) {
  const template = document.createElement('template');
  template.innerHTML = html.replace(/>[\n ] *</g, '><');
  return template;
}
