import { marked } from "marked";
import "./bootstrap.scss";

const main = document.body.querySelector('main')!;

function getPackageFromPath(pathname: string): Promise<string> {
  return Promise.resolve().then(() => {
    switch (pathname) {
      case '/list': return import('!!raw-loader!@nui/list/index.md');
      case '/tree': return import('!!raw-loader!@nui/tree/index.md');
      default: return Promise.reject(`No package found for ${pathname}`);
    }
  }).then((pkg) => {
    return marked(pkg.default);
  });
}

Promise.all([
  import("@nui/bundle"),
]).then(async () => {
  const { pathname } = document.location;
  return getPackageFromPath(pathname).then((content) => {
    main.innerHTML = content;
  }, () => {
    main.innerHTML = `
<nui-tree open>
    Branche 1
    <nui-tree open>
        Branche 1-1
        <nui-tree>Branche 1-1-1</nui-tree>
        <nui-tree>Branche 1-1-2</nui-tree>
    </nui-tree>
    <nui-tree>Branche 1-2</nui-tree>
</nui-tree>
`.replace(/[\n ] +/g, '');
  });
}).catch((error) => {
  console.error(error);
});
