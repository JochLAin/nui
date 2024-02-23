// Append and remove parent

const inner = document.createElement('span');
inner.id = 'inner';

const outer = document.createElement('div');
outer.id = 'outer';
document.body.appendChild(outer);

outer.appendChild(inner);
document.body.removeChild(outer);
console.log(inner);
