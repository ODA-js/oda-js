import { ModelItem } from './interfaces/types';
import { IModel } from './interfaces/IModel';
import { IPackage } from './interfaces/IPackage';
import { IEntity } from './interfaces/IEntity';
import { IField } from './interfaces/IField';
import { IRelation } from './interfaces/IRelation';
import { IBelongsToRelation } from './interfaces/IBelongsToRelation';
import { IBelongsToManyRelation } from './interfaces/IBelongsToManyRelation';
import { IHasOneRelation } from './interfaces/IHasOneRelation';
import { IHasManyRelation } from './interfaces/IHasManyRelation';

export function isModel(item: ModelItem): item is IModel {
  return item.modelType === 'model';
}

export function isPackage(item: ModelItem): item is IPackage {
  return item.modelType === 'package';
}

export function isEntity(item: ModelItem): item is IEntity {
  return item.modelType === 'entity';
}

export function isField(item: ModelItem): item is IField {
  return item.modelType === 'field';
}

export function isRelation(item: ModelItem): item is IRelation {
  return (
    item.modelType === 'BelongsTo'
    || item.modelType === 'BelongsToMany'
    || item.modelType === 'HasOne'
    || item.modelType === 'HasMany'
  );
}

export function IsBelongsTo(item: IRelation): item is IBelongsToRelation {
  return isRelation(item) && item.modelType === 'BelongsTo';
}

export function IsBelongsToMany(item: IRelation): item is IBelongsToManyRelation {
  return isRelation(item) && item.modelType === 'BelongsToMany';
}

export function IsHasOne(item: IRelation): item is IHasOneRelation {
  return isRelation(item) && item.modelType === 'HasOne';
}

export function IsHasMany(item: IRelation): item is IHasManyRelation {
  return isRelation(item) && item.modelType === 'HasMany';
}
