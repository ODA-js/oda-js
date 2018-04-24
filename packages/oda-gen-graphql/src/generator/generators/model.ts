import { lib } from 'oda-gen-common';
import { Factory } from 'fte.js';
import * as template from '../../graphql-backend-template';
import * as path from 'path';
import * as fs from 'fs-extra';

const { get, deepMerge } = lib;

export default function $generateModel(raw, rootDir, model, typeMapper: { [key: string]: (string) => string }, route: string, fileName: string) {
  let source = get(template, `model.${route}`).generate(raw, model, typeMapper);
  let fn = path.join(rootDir, fileName);

  if (typeof source === 'string') {
    let fn = path.join(rootDir, fileName);
    fs.ensureFileSync(fn);
    fs.writeFileSync(fn, source);
  } else if (Array.isArray(source)) {
    let parts = route.split('.').slice(1); // it is always `data`, at least here
    source.forEach(f => {
      let fn = path.join(rootDir, f.name);
      fs.ensureFileSync(fn);
      fs.writeFileSync(fn, f.content);
    });
  }

  fs.ensureFileSync(fn);
  fs.writeFileSync(fn, source);
}