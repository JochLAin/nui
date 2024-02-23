import * as path from "node:path";

export const PROJECT_DIR = `${__dirname}/../..`;
export const PACKAGE_DIR = `${PROJECT_DIR}/src`;

export const MODULES = {
  '@nui': path.resolve(PACKAGE_DIR, 'components'),
  '@nui-forms': path.resolve(PACKAGE_DIR, 'forms'),
  '@nui-themes': path.resolve(PACKAGE_DIR, 'themes'),
  '@nui-tools': path.resolve(PACKAGE_DIR, 'tools'),
};

export const PACKAGE = {
  "name": "@nui-tools/decorators",
  "version": "0.0.0",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "minimize": "terser --compress --mangle -o index.min.js -- index.js",
    "prepublishOnly": "npm run build",
    "test": "jest",
    "types": "tsc --emitDeclarationOnly"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/JochLAin/nui.git",
    "directory": "src/tools/element"
  },
  "author": "Jocelyn Faihy <jochlain@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/JochLAin/nui/issues"
  }
};

export const TSCONFIG = {
  "composite": true,
  "rootDir": ".",
  "outDir": ".",
  "module": "commonjs",
  "target": "es6",
  "lib": [
    "esnext",
    "dom"
  ],
  "allowJs": true,
  "allowSyntheticDefaultImports": true,
  "baseUrl": ".",
  "declaration": true,
  "emitDecoratorMetadata": true,
  "esModuleInterop": true,
  "experimentalDecorators": true,
  "forceConsistentCasingInFileNames": true,
  "incremental": true,
  "isolatedModules": true,
  "moduleResolution": "node",
  "noImplicitReturns": true,
  "noImplicitThis": true,
  "noImplicitAny": true,
  "noUnusedLocals": false,
  "noUnusedParameters": false,
  "preserveConstEnums": true,
  "removeComments": true,
  "resolveJsonModule": true,
  "skipLibCheck": true,
  "sourceMap": true,
  "strictNullChecks": true,
  "strict": true,
};
