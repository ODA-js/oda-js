import { Factory } from 'fte.js';
import {
  common as entities,
  pkg as templatePkg,
} from '../graphql-backend-template/schema';
import * as path from 'path';
import { writeFile } from './writeFile';
import { ModelPackage } from 'oda-model';

export default function generate(
  pkg: ModelPackage,
  raw: Factory,
  rootDir: string,
  role: string,
  allow,
  typeMapper: { [key: string]: (string) => string },
  adapter: string,
) {
  const sources = [];
  const prepared = [];
  console.time('prepare');
  prepared.push(templatePkg.prepare(pkg, role, allow, typeMapper, adapter));
  prepared.push(
    ...Array.from(pkg.entities.values()).map(entity => {
      return {
        entity: entity.name,
        ...entities.prepare(entity, pkg, role, allow, typeMapper, adapter),
      };
    }),
  );
  console.timeEnd('prepare');
  console.time('generate');
  prepared
    .map(item => {
      return (raw.run(item.ctx, item.template) as {
        name: string;
        content: string;
      }[]).map(r => ({
        entity: item.entity,
        ...r,
      }));
    })
    .reduce((result, curr) => {
      result.push(...curr);
      return result;
    }, sources);
  console.timeEnd('generate');
  sources.forEach(f => {
    let fn = path.join(
      ...[
        rootDir,
        pkg.name,
        ...(f.entity ? ['entities', f.entity] : [false]),
        f.name,
      ].filter(f => f),
    );
    writeFile(fn, f.content);
  });
}
