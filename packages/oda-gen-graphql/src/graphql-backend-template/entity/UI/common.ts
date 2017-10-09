import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { capitalize, decapitalize } from '../../utils';

export interface MapperOutupt {
  name: string;
  plural: string;
  listName: string;
  ownerFieldName: string;
  // unique: {
  //   args: { name: string, type: string }[];
  //   find: { name: string, type: string, cName: string }[];
  //   complex: { name: string, fields: { name: string, uName: string, type: string }[] }[];
  // }
  complexUnique: { name: string, fields: { name: string, uName: string, type: string }[] }[];
  relEntities: any[];
  relations: {
    required: boolean;
    derived: boolean;
    persistent: boolean;
    field: string;
    single: boolean;
    name: string;
    ref: {
      entity: string;
      fieldName: string;
    }
  }[];
  fields: {
    name: string;
    required: boolean;
  }[];
  persistent: {
    derived: boolean;
    persistent: boolean;
    field: string;
    single: boolean;
    name: string;
    ref: {
      entity: string;
      fieldName: string;
    }
  }[];
  args: {
    create: {
      args: { name: string; type: string; }[];
      find: { name: string; type: string; }[];
    };
    update: {
      args: { name: string; type: string; }[];
      find: { name: string; type: string; cName: string }[];
      payload: { name: string; type: string; }[];
    };
    remove: {
      args: { name: string; type: string; }[]
      find: { name: string; type: string; cName: string }[],
    };
  };
}

// для каждой операции свои параметры с типами должны быть.
// специальный маппер типов для ts где ID === string

import {
  getFieldsForAcl,
  singleStoredRelationsExistingIn,
  mutableFields,
  identityFields,
  getRelationNames,
  relationFieldsExistsIn,
  oneUniqueInIndex,
  complexUniqueIndex,
  getFields,
  idField,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  const singleStoredRelations = singleStoredRelationsExistingIn(pack);
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  let ids = getFields(entity).filter(idField);
  const mapToTSTypes = typeMapper.typescript;
  const mapToGQLTypes = typeMapper.graphql;

  const relations = fieldsAcl
    .filter(relationFieldsExistsIn(pack))
    .map(f => {
      let refe = pack.entities.get(f.relation.ref.entity);
      let verb = f.relation.verb;
      let ref = {
        opposite: f.relation.ref.field,
        usingField: '',
        backField: f.relation.ref.backField,
        entity: f.relation.ref.entity,
        queryName: decapitalize(f.relation.ref.entity),
        field: f.relation.ref.field,
        type: refe.fields.get(f.relation.ref.field).type,
        cField: capitalize(f.relation.ref.field),
        fields: [],
        listName: "",
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

        let opposite = getRelationNames(refe)
          // по одноименному классу ассоциации
          .filter(r => (current.opposite && current.opposite === r) || ((refe.fields.get(r).relation instanceof BelongsToMany)
            && (refe.fields.get(r).relation as BelongsToMany).using.entity === (f.relation as BelongsToMany).using.entity))
          .map(r => refe.fields.get(r).relation)
          .filter(r => r instanceof BelongsToMany && (current !== r))[0] as BelongsToMany;
        /// тут нужно получить поле по которому opposite выставляет свое значение,
        // и значение
        if (opposite) {
          ref.opposite = opposite.field;
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
        required: f.required,
        derived: f.derived,
        persistent: f.persistent,
        field: f.name,
        name: f.relation.fullName,
        shortName: f.relation.shortName,
        cField: capitalize(f.name),
        verb,
        single: verb === 'BelongsTo' || verb === 'HasOne',
        ref: {
          ...ref,
          fieldName: decapitalize(refFieldName),
        },
      };
    });

  return {
    name: entity.name,
    plural: entity.plural,
    listName: decapitalize(entity.plural),
    ownerFieldName: decapitalize(entity.name),
    relEntities: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => f.relation.ref.entity)
      .reduce((prev, curr) => {
        if (prev.indexOf(curr) === -1) {
          prev.push(curr);
        }
        return prev;
      }, [])
      .map(entity => pack.get(entity))
      .map(entity => {
        let fieldsEntityAcl = getFieldsForAcl(aclAllow)(role)(entity);
        return {
          name: entity.name,
          findQuery: decapitalize(entity.name),
          ownerFieldName: decapitalize(entity.name),
          unique: {
            args: [
              ...ids,
              ...fieldsEntityAcl
                .filter(identityFields)
                .filter(oneUniqueInIndex(entity))]
              .map(f => ({
                name: f.name,
                type: typeMapper.graphql(f.type),
              })),
            find: [
              ...fieldsEntityAcl
                .filter(identityFields)
                .filter(oneUniqueInIndex(entity))
                .map(f => ({
                  name: f.name,
                  type: typeMapper.graphql(f.type),
                  cName: capitalize(f.name),
                })),
            ],
            complex: complexUniqueIndex(entity).map(i => {
              let fields = Object.keys(i.fields)
                .map(fn => entity.fields.get(fn))
                .map(f => ({
                  name: f.name,
                  uName: capitalize(f.name),
                  type: typeMapper.graphql(f.type),
                })).sort((a, b) => {
                  if (a.name > b.name) return 1
                  else if (a.name < b.name) return -1;
                  else return 0;
                });
              return {
                name: i.name,
                fields,
              };
            }),
          },
        }
      }),

    complexUnique: complexUniqueIndex(entity).map(i => {
      let fields = Object.keys(i.fields)
        .map(fn => entity.fields.get(fn))
        .map(f => ({
          name: f.name,
          uName: capitalize(f.name),
          type: mapToTSTypes(f.type),
          gqlType: mapToGQLTypes(f.type),
        })).sort((a, b) => {
          if (a.name > b.name) return 1
          else if (a.name < b.name) return -1;
          else return 0;
        });;
      return {
        name: i.name,
        fields,
      };
    }),
    relations,
    persistent: relations.filter(f => f.persistent),
    fields: [
      ...ids,
      ...fieldsAcl
        .filter(f => mutableFields(f))]
      .map(f => ({
        name: f.name,
        required: f.required,
      })),
    args: {
      create: {
        args: [
          ...[
            ...ids,
            ...fieldsAcl
              .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))]
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
            }))],
        find: fieldsAcl
          .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          })),
      },
      update: {
        args: [
          ...[
            ...ids,
            ...fieldsAcl
              .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))]
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
            }))],
        find: [
          ...fieldsAcl
            .filter(identityFields)
            .filter(oneUniqueInIndex(entity))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
              cName: capitalize(f.name),
            }))],
        payload: fieldsAcl
          .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          })),
      },
      remove: {
        args: [
          ...[
            ...ids,
            ...fieldsAcl
              .filter(identityFields)
              .filter(oneUniqueInIndex(entity))]
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
            }))],
        find: [
          ...fieldsAcl
            .filter(identityFields)
            .filter(oneUniqueInIndex(entity))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
              gqlType: mapToGQLTypes(f.type),
              cName: capitalize(f.name),
            }))],
      },
    },
  };
}
