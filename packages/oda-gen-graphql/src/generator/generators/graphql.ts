import { utils } from 'oda-api-graphql';
import { Factory } from 'fte.js';
import * as template from '../../graphql-backend-template';
import * as path from 'path';
import * as fs from 'fs-extra';

const { get, deepMerge } = utils;

export default function $generateGraphql(pkg, raw: Factory, rootDir: string, role: string, allow, typeMapper: { [key: string]: (string) => string },
  collection, cfg, type, route: string, ext: string, fileName?: string) {
  let runConfig = get(cfg[type], route) as boolean | string[];
  if (runConfig) {
    let list;
    if (Array.isArray(runConfig)) {
      collection.filter(e => (runConfig as string[]).includes(e.name));
    } else {
      list = collection;
    }

    let parts = route.split('.');
    for (let entity of list) {
      let source = get(template, `${type}.${route}`).generate(raw, entity, pkg, role, allow, typeMapper);
      if (typeof source === 'string') {
        let parts = route.split('.');
        if (!fileName) {
          parts[parts.length - 1] = `${parts[parts.length - 1]}.${ext}`;
        } else {
          parts[parts.length - 1] = fileName;
        }
        let fn = path.join(rootDir, pkg.name, type, `${entity.name}`, ...parts);
        fs.ensureFileSync(fn);
        fs.writeFileSync(fn, source);
      } else if (Array.isArray(source)) {
        let parts = route.split('.');
        source.forEach(f => {
          parts[parts.length - 1] = `${f.name}.${ext}`;
          let fn = path.join(rootDir, pkg.name, type, `${entity.name}`, ...parts);
          fs.ensureFileSync(fn);
          fs.writeFileSync(fn, f.content);
        });
      }
    }
  }
}