import { marked } from "marked";
import "./bootstrap.scss";

const main = document.body.querySelector('main')!;

function getPackageFromPath(pathname: string): Promise<string> {
  return Promise.resolve().then(() => {
    switch (pathname) {
      case '/confirm': return import('@nui/confirm/index.md');
      case '/curtain': return import('@nui/curtain/index.md');
      case '/dropdown': return import('@nui/dropdown/index.md');
      case '/field': return import('@nui/field/index.md');
      case '/popin': return import('@nui/popin/index.md');
      case '/tree': return import('@nui/tree/index.md');

      default: return Promise.reject(`No package found for ${pathname}`);
    }
  }).then((pkg) => {
    return marked(pkg.default);
  });
}

Promise.all([
  import("@nui"),
]).then(async () => {
  const { pathname } = document.location;
  return getPackageFromPath(pathname).then((content) => {
    main.setAttribute('style', 'display: flex;flex-direction: row;width: 100vw;min-height: 100vh;padding: 1rem 2rem;gap: 2rem');
    main.innerHTML = content;
  }, (error) => {
    // console.error(error);
    // return import('./debug/collapse');
    return import('./experiments/form');
  });
}).catch((error) => {
  console.error(error);
});
