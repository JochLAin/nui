import "@nui";

const main = document.body.querySelector('main')!;
main.innerHTML = `
<form>
  <nui-field type="number" name="picsou" required value="1e9"></nui-field>
  <nui-field type="text" name="foo" required value="bar"></nui-field>
  <nui-input-number name="hello" required></nui-input-number>
  <nui-input-text name="world" required></nui-input-text>
  <button type="submit">Valider</button>
</form>
`.replace(/>\s+</g, '><');

const form = main.querySelector('form')!;
const field = form.querySelector('nui-input-text')!;
customElements.upgrade(field);
console.log(field.form);

const formData = new FormData(form);
console.log(formData.getAll('foo'));
form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const formData = new FormData(form);
  console.log(formData.getAll('foo'));
});
