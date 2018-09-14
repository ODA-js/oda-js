import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { decapitalize, capitalize } from '../utils';

export const template = 'entity/UI/ui-index.ts.njs';

export function generate(
  te: Factory,
  pack: ModelPackage,
  typeMapper: { [key: string]: (i: string) => string },
) {
  return te.run(mapper(pack, typeMapper), template);
}

export interface MapperOutput {
  name: string;
  role: string;
  entities: {
    name: string;
    entry: string;
  }[];
}

import { getEntities } from '../queries';

export function mapper(
  pack: ModelPackage,
  typeMapper: { [key: string]: (i: string) => string },
): MapperOutput {
  return {
    name: capitalize(pack.name),
    role: pack.name,
    entities: getEntities(pack).map(e => ({
      name: e.name,
      entry: decapitalize(e.name),
      embedded: e.embedded,
    })),
  };
}
