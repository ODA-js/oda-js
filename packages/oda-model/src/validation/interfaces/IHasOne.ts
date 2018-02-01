import { ArrayToMap, MapType } from '../model/utils';
import { IEntityRef } from './IEntityRef';
import { IField } from './IField';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';

export interface IHasOneInit extends Partial<IRelationInit> {
  hasOne: string | IEntityRef;
}

export interface IHasOneStore extends IRelationStore {
  hasOne: IEntityRef;
}

export interface IRelationTransform {
  hasOne: MapType<string | IEntityRef, IEntityRef>;
  fields: ArrayToMap<IField>;
}

export interface IHasOne extends IRelation {
  readonly verb: 'HasOne';
  readonly hasOne: IEntityRef;
}
