import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'package/package.viewer.ts.njs';

export function generate(
  te: Factory,
  pack: ModelPackage,
  typeMapper: { [key: string]: (i: string) => string },
) {
  return te.run(mapper(pack, typeMapper), template);
}

export interface MapperOutput {
  entities: { name: string }[];
}

import { getEntities } from '../queries';

export function mapper(
  pack: ModelPackage,
  typeMapper: { [key: string]: (i: string) => string },
): MapperOutput {
  return {
    entities: getEntities(pack).map(e => ({
      name: e.name,
    })),
  };
}
