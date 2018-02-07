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
import { IModelContext } from './contexts/IModelContext';
import { IEntityContext } from './contexts/IEntityContext';
import { IPackageContext } from './contexts/IPackageContext';
import { IFieldContext } from './contexts/IFieldContext';
import { IRelationContext } from './contexts/IRelationContext';
import { IEnumContext } from './contexts/IEnumContext';

export function IsBelongsToProps(item: Partial<IRelationInit>): item is IBelongsToInit {
  return !!(<IBelongsToInit>item).belongsTo;
}

export function IsBelongsToManyProps(item: Partial<IRelationInit>): item is IBelongsToManyInit {
  return !!(<IBelongsToManyInit>item).belongsToMany;
}

export function IsHasManyProps(item: Partial<IRelationInit>): item is IHasManyInit {
  return !!(<IHasManyInit>item).hasMany;
}

export function IsHasOneProps(item: Partial<IRelationInit>): item is IHasOneInit {
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

export function isIModelContext(ctx: IModelContext): ctx is IModelContext {
  return !!(ctx.isValid
    && ctx.model
    && Array.isArray(ctx.errors));
}

export function isIPackageContext(ctx: IModelContext): ctx is IPackageContext {
  return !!(ctx.isValid
    && (ctx as IPackageContext).model
    && (ctx as IPackageContext).package
    && Array.isArray((ctx as IPackageContext).errors));
}

export function isIEntityContext(ctx: IModelContext): ctx is IEntityContext {
  return !!(ctx.isValid
    && (ctx as IEntityContext).model
    && (ctx as IEntityContext).package
    && (ctx as IEntityContext).entity
    && Array.isArray((ctx as IEntityContext).errors));
}

export function isIEnumContext(ctx: IModelContext): ctx is IEnumContext {
  return !!(ctx.isValid
    && (ctx as IEnumContext).model
    && (ctx as IEnumContext).package
    && (ctx as IEnumContext).enum
    && Array.isArray((ctx as IEnumContext).errors));
}

export function isIFieldContext(ctx: IModelContext): ctx is IFieldContext {
  return !!(ctx.isValid
    && (ctx as IFieldContext).model
    && (ctx as IFieldContext).package
    && (ctx as IFieldContext).entity
    && (ctx as IFieldContext).field
    && Array.isArray((ctx as IFieldContext).errors));
}

export function isIRelationContext(ctx: IModelContext): ctx is IRelationContext {
  return !!(ctx.isValid
    && (ctx as IRelationContext).model
    && (ctx as IRelationContext).package
    && (ctx as IRelationContext).entity
    && (ctx as IRelationContext).field
    && (ctx as IRelationContext).relation
    && Array.isArray((ctx as IRelationContext).errors));
}