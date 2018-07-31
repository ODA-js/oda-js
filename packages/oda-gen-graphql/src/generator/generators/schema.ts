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
  adapter: 'mongoose' | 'sequelize',
  list,
) {
  const sources = [];
  const prepared = [];
  console.time('prepare');
  prepared.push(templatePkg.prepare(pkg, typeMapper));
  prepared.push(
    ...list.map(entity => {
      return {
        entity: entity.name,
        ...template.prepare(entity, pkg, role, allow, typeMapper, adapter),
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
  console.log(sources.length);
  sources.forEach(f => {
    let fn = path.join(
      ...[rootDir, '../gql', pkg.name, f.entity, f.name].filter(f => f),
    );
    writeFile(fn, f.content);
  });
}
