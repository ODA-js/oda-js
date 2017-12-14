import { utils } from 'oda-api-graphql';
import { Factory } from 'fte.js';
import * as template from '../../graphql-backend-template';
import * as path from 'path';
import * as fs from 'fs-extra';

const { get, deepMerge } = utils;

export default function $generateDataPkg(raw: Factory, rootDir: string, pkg: { name: string }, typeMapper: { [key: string]: (string) => string },
  route: string, fileName?: string) {
  let source = get(template, `packages.${route}`).generate(raw, pkg, typeMapper);
  if (typeof source === 'string') {
    let fn = path.join(rootDir, 'data', fileName);
    fs.ensureFileSync(fn);
    fs.writeFileSync(fn, source);
  } else if (Array.isArray(source)) {
    let parts = route.split('.').slice(1); // it is always `data`, at least here
    source.forEach(f => {
      let fn = path.join(rootDir, 'data', f.name);
      fs.ensureFileSync(fn);
      fs.writeFileSync(fn, f.content);
    });
  }
}