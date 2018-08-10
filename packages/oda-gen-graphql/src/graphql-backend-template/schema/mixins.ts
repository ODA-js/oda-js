import { ModelPackage, Mixin } from 'oda-model';
import { printRequired, printArguments } from './../utils';

export interface MapperOutput {
  name: string;
  fields: {
    name: string;
    description: string;
    type: string;
    args: string;
  }[];
}

import {
  getFieldsForAcl,
  fields,
  idField,
  memoizeEntityMapper,
} from '../queries';

export function mapper(
  entity: Mixin,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
  adapter: string,
): MapperOutput {
  let fieldsAcl = getFieldsForAcl(role, pack)(aclAllow, entity);
  return {
    name: entity.name,
    fields: fieldsAcl.filter(fields).map(f => {
      let args = printArguments(f, typeMapper.graphql);
      return {
        name: f.name,
        description: f.description
          ? f.description
              .split('\n')
              .map(d => {
                return d.trim().match(/#/) ? d : `# ${d}`;
              })
              .join('\n')
          : f.description,
        type: `${idField(f) ? 'ID' : typeMapper.graphql(f.type)}${printRequired(
          f,
        )}`,
        args: args ? `(${args})` : '',
      };
    }),
  };
}
