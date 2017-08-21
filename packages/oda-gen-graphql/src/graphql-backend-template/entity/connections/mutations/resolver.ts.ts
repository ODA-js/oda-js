import { Entity, ModelPackage } from 'oda-model';
import { capitalize, decapitalize } from '../../../utils';
import { Factory } from 'fte.js';
import { persistentRelations, getFieldsForAcl } from '../../../queries';

export const template = 'entity/connections/mutations/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(entity, pack, role, aclAllow, typeMapper), template);
}

export interface MapperOutupt {
  name: string;
  ownerFieldName: string;
  connections: {
    opposite: string;
    relationName: string,
    name: string;
    refEntity: string;
    addArgs: { name: string; type: string; }[];
    removeArgs: { name: string; type: string; }[];
    ref: {
      fields: string[];
    }
  }[];
}

// для каждой операции свои параметры с типами должны быть.
// специальный маппер типов для ts где ID === string

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  return {
    name: entity.name,
    ownerFieldName: decapitalize(entity.name),
    connections: getFieldsForAcl(aclAllow)(role)(entity)
      .filter(persistentRelations(pack))
      .map(f => {
        let verb = f.relation.verb;
        let ref = {
          fields: [],
        };
        let sameEntity = entity.name === f.relation.ref.entity;
        let refFieldName = `${f.relation.ref.entity}${sameEntity ? capitalize(f.name) : ''}`;
        let refEntity = f.relation.ref.entity;
        let addArgs = [
          {
            name: decapitalize(entity.name),
            type: 'string',
          },
          {
            name: decapitalize(refFieldName),
            type: 'string',
          },
        ];
        let removeArgs = [...addArgs];

        if (verb === 'BelongsToMany') {
          if (f.relation.fields && f.relation.fields.length > 0) {
            f.relation.fields.forEach(field => {
              ref.fields.push(field.name);
              addArgs.push({
                name: field.name,
                type: typeMapper.typescript(field.type),
              });
            });
          }
        }
        return {
          opposite: f.relation.opposite,
          refEntity,
          relationName: f.relation.fullName,
          shortName: f.relation.shortName,
          name: f.name,
          refFieldName: decapitalize(refFieldName),
          addArgs,
          removeArgs,
          ref,
        };
      }),
  };
}
