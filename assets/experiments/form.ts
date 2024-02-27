import "@nui";

const main = document.body.querySelector('main')!;
main.innerHTML = `
<form>
  <nui-field type="number" name="foo" required value="1e9"></nui-field>
  <nui-field type="text" name="foo" required value="bar"></nui-field>
  <button type="submit">Valider</button>
</form>
`;

const form = main.querySelector('form')!;
const field = form.querySelector('nui-field')!;
customElements.upgrade(field);

console.log(field.validationMessage);

const formData = new FormData(form);
console.log(formData.getAll('foo'));

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
});
