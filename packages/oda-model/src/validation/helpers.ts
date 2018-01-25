import { ModelItem, Relation } from './interfaces/types';
import { IModel } from './interfaces/IModel';
import { IPackage } from './interfaces/IPackage';
import { IEntity } from './interfaces/IEntity';
import { IField } from './interfaces/IField';
import { IRelation } from './interfaces/IRelation';
import { IBelongsToRelation } from './interfaces/IBelongsToRelation';
import { IBelongsToManyRelation } from './interfaces/IBelongsToManyRelation';
import { IHasOneRelation } from './interfaces/IHasOneRelation';
import { IHasManyRelation } from './interfaces/IHasManyRelation';
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

export function isRelation(item: ModelItem): item is Relation {
  return (
    item.modelType === 'BelongsTo'
    || item.modelType === 'BelongsToMany'
    || item.modelType === 'HasOne'
    || item.modelType === 'HasMany'
  );
}

export function IsBelongsTo(item: Relation): item is IBelongsToRelation {
  return isRelation(item) && item.modelType === 'BelongsTo';
}

export function IsBelongsToMany(item: Relation): item is IBelongsToManyRelation {
  return isRelation(item) && item.modelType === 'BelongsToMany';
}

export function IsHasOne(item: Relation): item is IHasOneRelation {
  return isRelation(item) && item.modelType === 'HasOne';
}

export function IsHasMany(item: Relation): item is IHasManyRelation {
  return isRelation(item) && item.modelType === 'HasMany';
}
