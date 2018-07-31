import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { capitalize } from '../utils';

export const template = 'schema/package.ts.njs';

export function prepare(
  pack: ModelPackage,
  typeMapper: { [key: string]: (string) => string },
) {
  return { ctx: mapper(pack, typeMapper), template };
}

export interface MapperOutput {
  name: string;
  entities: { name: string }[];
}

import { getEntities } from '../queries';

export function mapper(
  pack: ModelPackage,
  typeMapper: { [key: string]: (string) => string },
): MapperOutput {
  return {
    name: capitalize(pack.name),
    entities: getEntities(pack).map(e => ({
      name: e.name,
    })),
  };
}
