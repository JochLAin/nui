import * as fs from "node:fs/promises";
import * as path from "node:path";
import sass from "sass";
import { MODULES, PACKAGE_DIR, PROJECT_DIR } from "./constant";

export async function getModuleFiles(mod: string, regex?: RegExp): Promise<string[]> {
  async function closure(name: string): Promise<string[]> {
    const children = await fs.readdir(path.resolve(PACKAGE_DIR, name));
    const items = await Promise.all(children.map(async (child) => {
      const filename = path.resolve(PACKAGE_DIR, name, child);
      const result = path.relative(path.resolve(PACKAGE_DIR, mod), filename);
      const stat = await fs.stat(filename);

      if (stat.isDirectory()) {
        return closure(`${name}/${child}`);
      } else if (!stat.isFile()) {
        throw new Error(`Found not file nor directory at ${result}`);
      }

      if (regex && !regex.test(result)) return [];
      return [result];
    }));

    return items.reduce((accu, children) => [...accu, ...children], []);
  }

  return closure(mod);
}

export async function getModules() {
  async function read(dir: string) {
    const filenames = await fs.readdir(dir);
    return filenames.map((filename) => {
      return `${dir}/${filename}`;
    });
  }

  const promises = Object.values(MODULES).map((folder) => read(folder));
  const items = await Promise.all(promises);
  return items.reduce((accu, packages) => {
    return [...accu, ...packages];
  }, []).map((filename) => {
    return path.relative(PACKAGE_DIR, filename);
  });
}

export async function prepareModules() {
  const modules = await getModules();
  const dict = new Map();
  for (let idxModule = 0; idxModule < modules.length; idxModule++) {
    const mod = modules[idxModule];
    const files = await getModuleFiles(mod, /\.ts$/);
    for (let idxFile = 0; idxFile < files.length; idxFile++) {
      const file = files[idxFile];
      dict.set(
        path.resolve(PROJECT_DIR, 'dist', mod, file),
        await getModuleFileContent(mod, file)
      );
    }
  }

  return Promise.all(Array.from(dict.entries()).map(async ([filename, content]) => {
    await fs.mkdir(path.dirname(filename), { recursive: true });
    try { await fs.unlink(filename); } catch (e) {}
    await fs.writeFile(filename, content);
  }));
}

async function getModuleFileContent(mod: string, file: string) {
  const filename = path.resolve(PACKAGE_DIR, mod, file);
  const dirname = path.dirname(filename);

  function replaceInternalModule(content: string) {
    return content
      .replaceAll(/@nui-tools/g, path.relative(dirname, MODULES['@nui-tools']))
      .replaceAll(/@nui/g, path.relative(dirname, MODULES['@nui']))
    ;
  }

  async function replaceStyles(content: string) {
    const matches = Array.from(content.matchAll(/(import (\w+) from ["']([\w./]+)["'];)/g)).map((match) => match.slice(1, 4));
    for (let idx = 0; idx < matches.length; idx++) {
      const [line, name, file] = matches[idx];
      const scss = (await fs.readFile(path.resolve(dirname, file))).toString();
      const { css } = sass.compileString(scss, { style: 'compressed' });
      content = content.replace(line, `const ${name} = "${css}";`);
    }
    return content;
  }

  return Promise.resolve().then(() => {
    return fs.readFile(filename);
  }).then((content) => {
    return replaceInternalModule(content.toString());
  }).then((content) => {
    return replaceStyles(content);
  });
}
