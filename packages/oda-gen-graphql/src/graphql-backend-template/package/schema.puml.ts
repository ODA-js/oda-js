import { ModelPackage, BelongsToMany } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'package/schema.puml.njs';

export function generate(te: Factory, pack: ModelPackage) {
  return te.run(mapper(pack), template);
}

export interface RelationsList {
  src: string;
  field: string;
  dest: string;
  single: boolean;
  verb: string;
  opposite: string;
  using?: string;
};

export interface MapperOutupt {
  relations: RelationsList[];
  entities: {
    name: string;
    queries: {
      name: string;
      type: string;
      args: string;
      single: boolean;
    }[],
    fields: {
      name: string;
      type: string;
    }[],
  }[];
}

import {
  getFields,
  getEntities,
  storedRelationsExistingIn,
  derivedFieldsAndRelations,
  persistentFields,
} from '../queries';

export function mapper(pack: ModelPackage): MapperOutupt {

  let relList = new Map(pack.relations.entries());
  relList.forEach((rels, entity) => {
    rels.forEach((rel, fiedls) => {
      if (rel.relation.opposite) {
        relList.get(rel.relation.ref.entity).delete(rel.relation.opposite);
      }
    });
  });

  let relations: RelationsList[] = Array.from(relList).reduce((result: RelationsList[], curEntity) => {
    let src = curEntity[0];
    Array.from(curEntity[1].entries()).reduce((res, cur) => {
      res.push({
        src,
        field: cur[0],
        dest: cur[1].relation.ref.entity,
        single: cur[1].relation.single,
        verb: cur[1].relation.verb,
        opposite: cur[1].relation.opposite,
        using: cur[1].relation.verb === 'BelongsToMany' ? (cur[1].relation as BelongsToMany).using.entity : '',
      });
      return res;
    }, result);
    return result;
  }, []);
  return {
    relations,
    entities: getEntities(pack)
      .map(e => ({
        name: e.name,
        fields: getFields(e)
          .filter(f => persistentFields(f) || storedRelationsExistingIn(pack)(f))
          .map(f => ({
            name: f.name,
            type: (f.relation && f.relation.ref.toString()) || f.type,
          })),
        queries: getFields(e)
          .filter(derivedFieldsAndRelations)
          .map(f => ({
            name: f.name,
            type: (f.relation && f.relation.ref.entity) || f.type,
            args: (f.args && f.args.map(a => `${a.name}: ${a.type}`) || []).join(','),
            single: (f.relation && f.relation.single) || true,
          })),
      })),
  };
}
