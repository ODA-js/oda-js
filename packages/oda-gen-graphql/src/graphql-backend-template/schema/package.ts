import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { capitalize, printArguments } from '../utils';

export const template = 'schema/package';

export function prepare(
  pack: ModelPackage,
  typeMapper: { [key: string]: (string) => string },
) {
  return { ctx: mapper(pack, typeMapper), template };
}

export interface MapperOutput {
  name: string;
  entities: { name: string }[];
  scalars: { name: string }[];
  directives: { name: string }[];
  enums: { name: string }[];
  mutations: MutationQueryOutput[];
  queries: MutationQueryOutput[];
  unions: {
    name: string;
    items: string[];
  }[];
}

import {
  getEntities,
  getScalars,
  getDirvectives,
  getEnums,
  getMutations,
  getQueries,
  getUnions,
} from '../queries';

import {
  mapper as mutation__query__mapper,
  MutationQueryOutput,
} from './mutation-query';

export function mapper(
  pack: ModelPackage,
  typeMapper: { [key: string]: (string) => string },
): MapperOutput {
  return {
    name: capitalize(pack.name),
    entities: getEntities(pack).map(e => ({
      name: e.name,
      adapter: e.getMetadata('storage.adapter', 'mongoose'),
    })),
    scalars: getScalars(pack).map(s => ({
      name: s.name,
    })),
    directives: getDirvectives(pack).map(s => ({
      name: s.name,
      args: printArguments(s, typeMapper.graphql),
      on: s.on.join('|'),
    })),
    enums: getEnums(pack).map(s => ({
      name: s.name,
      items: s.items,
      hasCustomValue: s.items.some(i => !!i.value),
    })),
    mutations: getMutations(pack).map(m =>
      mutation__query__mapper(m, pack, typeMapper),
    ),
    queries: getQueries(pack).map(q =>
      mutation__query__mapper(q, pack, typeMapper),
    ),
    unions: getUnions(pack).map(u => ({
      name: u.name,
      items: u.items,
    })),
  };
}
