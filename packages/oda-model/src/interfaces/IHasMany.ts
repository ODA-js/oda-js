import { ConvertToMap, MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';

export interface IHasManyInit extends Partial<IRelationInit> {
  hasMany: string | IEntityRef;
}

export interface IHasManyStore extends IRelationStore {
  hasMany: IEntityRef;
}

export interface IRelationTransform {
  hasMany: MapType<string | IEntityRef, IEntityRef>;
  fields: ConvertToMap<IField, Partial<IField>>;
}

export interface IHasMany extends IRelation {
  readonly verb: 'HasMany';
  readonly hasMany: IEntityRef;
}

