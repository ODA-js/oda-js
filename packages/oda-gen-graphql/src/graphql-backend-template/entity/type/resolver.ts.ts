import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { capitalize, decapitalize } from '../../utils';
import { Factory } from 'fte.js';

export const template = 'entity/type/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl) {
  return te.run(mapper(entity, pack, role, allowAcl), template);
}

export interface MapperOutupt {
  name: string;
  description: string;
  ownerFieldName: string;
  fields: any;
  relations: {
    derived: boolean;
    field: string;
    refFieldName: string;
    name: string;
    verb: string,
    ref: {
      backField: string;
      usingField: string;
      field: string;
      cField: string;
      entity: string;
      fields: string[];
      using: {
        backField: string;
        entity: string;
        field: string;
      }
    }
  }[];
}

// для каждой операции свои параметры с типами должны быть.
// специальный маппер типов для ts где ID === string

import {
  getFieldsForAcl,
  getRelationNames,
  relationFieldsExistsIn,
  derivedFields,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl): MapperOutupt {
  let fieldsAcl = getFieldsForAcl(allowAcl)(role)(entity);
  return {
    name: entity.name,
    ownerFieldName: decapitalize(entity.name),
    description: entity.description,
    relations: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => {
        let verb = f.relation.verb;

        let ref = {
          usingField: '',
          backField: f.relation.ref.backField,
          entity: f.relation.ref.entity,
          field: f.relation.ref.field,
          cField: capitalize(f.relation.ref.field),
          fields: [],
          using: {
            backField: '',
            entity: '',
            field: '',
          },
        };
        if (verb === 'BelongsToMany') {
          let current = (f.relation as BelongsToMany);
          ref.using.entity = current.using.entity;
          ref.using.field = current.using.field;
          ref.backField = current.using.backField;
          //from oda-model/model/belongstomany.ts ensure relation class
          let refe = pack.entities.get(ref.entity);
          let opposite = getRelationNames(refe)
            // по одноименному классу ассоциации
            .filter(r => (current.opposite && current.opposite == r) || ((refe.fields.get(r).relation instanceof BelongsToMany)
              && (refe.fields.get(r).relation as BelongsToMany).using.entity === (f.relation as BelongsToMany).using.entity))
            .map(r => refe.fields.get(r).relation)
            .filter(r => r instanceof BelongsToMany && (current !== r))[0] as BelongsToMany;
          /// тут нужно получить поле по которому opposite выставляет свое значение,
          // и значение
          if (opposite) {
            ref.usingField = opposite.using.field;
            ref.backField = opposite.ref.field;
          } else {
            ref.usingField = decapitalize(ref.entity);
          }
          if (f.relation.fields && f.relation.fields.length > 0) {
            f.relation.fields.forEach(field => {
              ref.fields.push(field.name);
            });
          }
        }
        let sameEntity = entity.name === f.relation.ref.entity;
        let refFieldName = `${f.relation.ref.entity}${sameEntity ? capitalize(f.name) : ''}`;
        return {
          derived: f.derived,
          field: f.name,
          name: capitalize(f.name),
          refFieldName: decapitalize(refFieldName),
          verb,
          ref,
        };
      }),
    fields: fieldsAcl
      .filter(derivedFields)// пригодиться для security Проверки по полям
      .map(f => {
        return {
          derived: f.derived,
          field: f.name,
          name: capitalize(f.name),
          // можно добавить аргументы
        };
      }),
  };
}
