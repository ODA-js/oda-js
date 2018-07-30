import { Factory } from 'fte.js';
import {
  common as template,
  pkg as templatePkg,
} from '../../graphql-backend-template/schema';
import * as path from 'path';
import { writeFile } from './writeFile';

export default function $generate(
  pkg,
  raw: Factory,
  rootDir: string,
  role: string,
  allow,
  typeMapper: { [key: string]: (string) => string },
  list,
) {
  let source = templatePkg.generate(raw, pkg, typeMapper);
  source.forEach(f => {
    let fn = path.join(rootDir, pkg.name, f.name);
    writeFile(fn, f.content);
  });
  for (let entity of list) {
    let source = template.generate(raw, entity, pkg, role, allow, typeMapper);
    source.forEach(f => {
      let fn = path.join(rootDir, pkg.name, entity.name, f.name);
      writeFile(fn, f.content);
    });
  }
}
