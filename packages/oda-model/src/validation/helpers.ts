import { IBelongsTo, IBelongsToInit } from './interfaces/IBelongsTo';
import { IBelongsToMany, IBelongsToManyInit } from './interfaces/IBelongsToMany';
import { IEntity } from './interfaces/IEntity';
import { IField } from './interfaces/IField';
import { IHasMany, IHasManyInit } from './interfaces/IHasMany';
import { IHasOne, IHasOneInit } from './interfaces/IHasOne';
import { IModel } from './interfaces/IModel';
import { IMutation } from './interfaces/IMutation';
import { IPackage } from './interfaces/IPackage';
import { IRelation, IRelationInit } from './interfaces/IRelation';
import { IModelType } from './interfaces/IModelType';
import { IEnum } from './interfaces/IEnum';

export function IsBelongsToProps(item: IRelationInit): item is IBelongsToInit {
  return !!(<IBelongsToInit>item).belongsTo;
}

export function IsBelongsToManyProps(item: IRelationInit): item is IBelongsToManyInit {
  return !!(<IBelongsToManyInit>item).belongsToMany;
}

export function IsHasManyProps(item: IRelationInit): item is IHasManyInit {
  return !!(<IHasManyInit>item).hasMany;
}

export function IsHasOneProps(item: IRelationInit): item is IHasOneInit {
  return !!(<IHasOneInit>item).hasOne;
}

export function isModel(item: IModelType): item is IModel {
  return item.modelType === 'model';
}

export function isPackage(item: IModelType): item is IPackage {
  return item.modelType === 'package';
}

export function isEntity(item: IModelType): item is IEntity {
  return item.modelType === 'entity';
}

export function isMutation(item: IModelType): item is IMutation {
  return item.modelType === 'mutation';
}

export function isField(item: IModelType): item is IField {
  return item.modelType === 'field';
}

export function isEnum(item: IModelType): item is IEnum {
  return item.modelType === 'enum';
}

export function isRelation(item: IModelType): item is IRelation {
  return (
    item.modelType === 'relation'
  );
}

export function IsBelongsTo(item: IRelation): item is IBelongsTo {
  return isRelation(item) && item.verb === 'BelongsTo';
}

export function IsBelongsToMany(item: IRelation): item is IBelongsToMany {
  return isRelation(item) && item.verb === 'BelongsToMany';
}

export function IsHasOne(item: IRelation): item is IHasOne {
  return isRelation(item) && item.verb === 'HasOne';
}

export function IsHasMany(item: IRelation): item is IHasMany {
  return isRelation(item) && item.verb === 'HasMany';
}
