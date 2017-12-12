import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { capitalize, decapitalize } from '../../utils';
import * as humanize from 'string-humanize';

const formPriority = {
  list: 1,
  show: 2,
  edit: 3,
  hidden: 4,
};

export interface UIResult {
  listName: string;
  quickSearch: string[];
  hidden?: string[];
  edit?: string[];
  show?: string[];
  list?: string[];
  embedded?: string[];
}

export interface embeddedRel {
  name: string,
  type: string,
  required: boolean;
};

export interface embedded {
  name: string;
  entity: string,
  single: boolean,
  fields: embeddedRel[],
}

export interface UIView {
  listName: string;
  quickSearch: string[];
  hidden?: { [key: string]: boolean };
  edit?: { [key: string]: boolean };
  show?: { [key: string]: boolean };
  list?: { [key: string]: boolean };
  embedded?: {
    names: { [key: string]: number };
    items: embedded[];
  }
}

export interface MapperOutupt {
  packageName: string;
  name: string;
  UI: UIView;
  plural: string;
  listLabel: {
    type: string;
    source: any;
  };
  listName: string;
  ownerFieldName: string;
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
      listLabel: {
        type: string;
        source: any;
      };
    }
  }[];
  fields: {
    name: string;
    required: boolean;
  }[];
}

// для каждой операции свои параметры с типами должны быть.
// специальный маппер типов для ts где ID === string

import {
  getFieldsForAcl,
  singleStoredRelationsExistingIn,
  fields,
  identityFields,
  getRelationNames,
  relationFieldsExistsIn,
  oneUniqueInIndex,
  complexUniqueIndex,
  complexUniqueFields,
  getFields,
  idField,
} from '../../queries';
import { platform } from 'os';

function visibility(pack: ModelPackage, entity: Entity, aclAllow, role, aor, first = false): UIView {
  const result: UIResult = {
    listName: guessListLabel(entity, aclAllow, role, aor).source,
    quickSearch: guessQuickSearch(entity, aclAllow, role, aor),
    hidden: [],
    edit: [],
    show: [],
    list: [],
    embedded: [],
  };
  let allFields = getFieldsForAcl(aclAllow)(role)(entity);
  result.edit.push(...allFields.map(f => f.name));
  result.show.push(...result.edit);
  result.list.push(...allFields.
    filter(oneUniqueInIndex(entity))
    .map(f => f.name));
  result.list.push(...complexUniqueFields(entity)
    .map(f => entity.fields.get(f))
    .filter(f => aclAllow(role, f.getMetadata('acl.read', role)))
    .map(f => f.name));

  // придумать как вытаскивать реляции из модели...
  //

  const UI = entity.getMetadata('UI');
  if (UI) {
    if (UI.hidden && Array.isArray(UI.hidden)) {
      result.hidden.push(...UI.hidden);
    }

    if (UI.edit && Array.isArray(UI.edit)) {
      result.edit.push(...UI.edit);
    }

    if (UI.show && Array.isArray(UI.show)) {
      result.show.push(...UI.show);
    }

    if (UI.list && Array.isArray(UI.list)) {
      result.list.push(...UI.list);
    }
    if (UI.embedded && Array.isArray(UI.embedded)) {
      result.embedded.push(...UI.embedded);
    }
    if (UI.quickSearch && Array.isArray(UI.quickSearch)) {
      result.quickSearch.push(...UI.quickSearch);
    }
  }

  const res: UIView = {
    listName: result.listName,
    quickSearch: result.quickSearch.reduce((r, c) => {
      if (r.indexOf(c) === -1) {
        r.push(c);
      }
      return r;
    }, []),
    hidden: result.hidden.reduce((r, c) => {
      if (r[c] !== false) {
        if (!/\^/.test(c)) {
          r[c] = true;
        } else {
          r[c.slice(1)] = false;
        }
      }
      return r;
    }, {}),
  };

  res.list = result.list.filter(f => !res.hidden[f])
    .reduce((r, c) => {
      if (r[c] !== false) {
        if (!/\^/.test(c)) {
          r[c] = true;
        } else {
          r[c.slice(1)] = false;
        }
      }
      return r;
    }, {});

  res.edit = result.edit.filter(f => !res.hidden[f] && !res.list[f])
    .reduce((r, c) => {
      if (r[c] !== false) {
        if (!/\^/.test(c)) {
          r[c] = true;
        } else {
          r[c.slice(1)] = false;
        }
      }
      return r;
    }, {});

  res.show = result.show.filter(f => !res.hidden[f] && !res.edit[f] && !res.list[f])
    .reduce((r, c) => {
      if (r[c] !== false) {
        if (!/\^/.test(c)) {
          r[c] = true;
        } else {
          r[c.slice(1)] = false;
        }
      }
      return r;
    }, {});

  if (first) {
    const embedItems = allFields.filter(f => f.relation && result.embedded.indexOf(f.name) > -1)
      .map(f => {
        const lRes: embedded = {
          name: f.name,
          single: f.relation.single,
          entity: f.relation.ref.entity,
          fields: [],
        };
        const re = pack.entities.get(f.relation.ref.entity);
        const reUI = visibility(pack, re, aclAllow, role, aor);
        const fList = Array.from(re.fields.values())
          // потом беру все поля которые редактируются,
          .filter(f => reUI.edit[f.name] || reUI.list[f.name] || reUI.show[f.name])
          // проверяю что это не связи,
          .filter(f => !f.relation)
          // формирую список полей и возвращаю
          .map(f => ({
            name: f.name,
            cName: capitalize(f.name),
            label: humanize(f.name),
            type: aor(f.type),
            required: f.required,

          }));

        lRes.fields.push(...fList);
        return lRes;
      }, {});

    res.embedded = {
      items: embedItems,
      names: embedItems.reduce((r, f, index) => {
        r[f.name] = index;
        return r;
      }, {}),
    }
  }

  return res;
}

function guessListLabel(entity, aclAllow, role, aor) {
  let UI = entity.getMetadata('UI');
  let result = {
    type: 'Text',
    source: 'id',
  };
  if (UI && UI.listName) {
    result.source = UI.listName;
  } else {
    let res = getFieldsForAcl(aclAllow)(role)(entity).filter(identityFields)
      .filter(oneUniqueInIndex(entity))[0];
    if (res) {
      result.type = aor(res.type);
      result.source = res.name;
    }
  }
  return result;
}

function guessQuickSearch(entity: Entity, aclAllow, role, aor) {
  let UI = entity.getMetadata('UI');
  let result = [];
  if (UI && UI.listName) {
    const lf = entity.fields.get(UI.listName);
    if (lf && lf.persistent) {
      result.push(UI.listName);
    }
  }
  result.push(...getFieldsForAcl(aclAllow)(role)(entity).filter(identityFields)
    .filter(oneUniqueInIndex(entity)).map(i => i.name));
  return result;
}

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  const singleStoredRelations = singleStoredRelationsExistingIn(pack);
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  let ids = getFields(entity).filter(idField);
  const mapToTSTypes = typeMapper.typescript;
  const mapToGQLTypes = typeMapper.graphql;
  const mapAORTypes = typeMapper.aor;
  const mapResourceTypes = typeMapper.resource;
  const mapAORFilterTypes = typeMapper.aor;
  const UI = visibility(pack, entity, aclAllow, role, mapAORTypes, true);
  const mapFields = f => ({
    name: f.name,
    persistent: f.persistent,
    derived: f.derived,
    cName: capitalize(f.name),
    label: humanize(f.name),
    required: f.required,
    type: mapAORTypes(f.type),
    resourceType: mapResourceTypes(f.type),
    filterType: mapAORFilterTypes(f.type),
  })

  const relations = fieldsAcl
    .filter(relationFieldsExistsIn(pack))
    .sort((a, b) => a.order > b.order ? 1 : -1)
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
        label: humanize(f.relation.ref.field),
        fields: [],
        listName: '',
        using: {
          UI: undefined,
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
        if (f.relation.fields && f.relation.fields.size > 0) {
          const using = pack.entities.get(ref.using.entity);
          ref.using.UI = visibility(pack, using, aclAllow, role, mapAORTypes);
          debugger;
          f.relation.fields.forEach(field => {
            ref.fields.push(mapFields(using.fields.get(field.name)));
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
        label: humanize(f.name),
        verb,
        single: verb === 'BelongsTo' || verb === 'HasOne',
        ref: {
          ...ref,
          fieldName: decapitalize(refFieldName),
          listLabel: guessListLabel(refe, aclAllow, role, mapAORTypes),
        },
      };
    });

  return {
    packageName: pack.name,
    name: entity.name,
    UI,
    plural: entity.plural,
    listLabel: guessListLabel(entity, aclAllow, role, mapAORTypes),
    listName: decapitalize(entity.plural),
    ownerFieldName: decapitalize(entity.name),
    relations,
    fields: [
      ...ids,
      ...fieldsAcl
        .filter(f => fields(f) && !idField(f))
        .sort((a, b) => a.order > b.order ? 1 : -1)
    ]
      .map(mapFields),
  };
}
