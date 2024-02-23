const main = document.body.querySelector('main')!;
main.setAttribute('style', 'display: flex;flex-direction: row;width: 100vw;min-height: 100vh;padding: 1rem 2rem;gap: 2rem');

main.innerHTML = `
<style>
  :root {
    --color: green;
  }
  article {
    ---color-surround: var(--color-surround, var(--color, blue));
  }
  div {
    --color: var(---color-surround);
  }
  span {
    color: var(--color, red);
  }
</style>
<article>
  <div>
    <span>Hello</span>
  </div>
</article>
`.replace(/[\n ] +/g, '');
