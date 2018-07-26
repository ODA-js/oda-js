import { Factory } from 'fte.js';
import { common as template } from '../../graphql-backend-template/schema';
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
  for (let entity of list) {
    let source = template.generate(raw, entity, pkg, role, allow, typeMapper);
    source.forEach(f => {
      let fn = path.join(rootDir, pkg.name, entity.name, f.name);
      writeFile(fn, f.content);
    });
  }
}
