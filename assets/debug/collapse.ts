import "@nui/collapse";

const main = document.body.querySelector('main')!;
main.setAttribute('style', 'display: flex;flex-direction: row;width: 100vw;min-height: 100vh;padding: 1rem 2rem;gap: 2rem');

main.innerHTML = `
<style>
    nui-collapse {
      --nui-collapse--content-offset: 1.25rem;    
      --nui-collapse--toggle-offset: 1.25rem;
    }
</style>
<nui-collapse open>
  <span slot="toggle">Hello</span>
  <div slot="content">World</div>
</nui-collapse>
`.replace(/[\n ] +/g, '');
