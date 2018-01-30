import { ModelItem, RelationUnion } from './interfaces/types';
import { IModel } from './interfaces/IModel';
import { IPackage } from './interfaces/IPackage';
import { IEntity } from './interfaces/IEntity';
import { IField } from './interfaces/IField';
import { IRelation } from './interfaces/IRelation';
import { IBelongsTo } from './interfaces/IBelongsTo';
import { IBelongsToMany } from './interfaces/IBelongsToMany';
import { IHasOne } from './interfaces/IHasOne';
import { IHasMany } from './interfaces/IHasMany';
import {IMutation} from './interfaces/IMutation';

export function isModel(item: ModelItem): item is IModel {
  return item.modelType === 'model';
}

export function isPackage(item: ModelItem): item is IPackage {
  return item.modelType === 'package';
}

export function isEntity(item: ModelItem): item is IEntity {
  return item.modelType === 'entity';
}

export function isMutation(item: ModelItem): item is IMutation {
  return item.modelType === 'mutation';
}

export function isField(item: ModelItem): item is IField {
  return item.modelType === 'field';
}

export function isRelation(item: ModelItem): item is RelationUnion {
  return (
    item.modelType === 'relation'
  );
}

export function IsBelongsTo(item: RelationUnion): item is IBelongsTo {
  return isRelation(item) && item.verb === 'BelongsTo';
}

export function IsBelongsToMany(item: RelationUnion): item is IBelongsToMany {
  return isRelation(item) && item.verb === 'BelongsToMany';
}

export function IsHasOne(item: RelationUnion): item is IHasOne {
  return isRelation(item) && item.verb === 'HasOne';
}

export function IsHasMany(item: RelationUnion): item is IHasMany {
  return isRelation(item) && item.verb === 'HasMany';
}
