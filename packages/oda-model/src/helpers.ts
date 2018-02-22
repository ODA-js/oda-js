import { IEntityContext } from './contexts/IEntityContext';
import { IEnumContext } from './contexts/IEnumContext';
import { IFieldContext } from './contexts/IFieldContext';
import { IModelContext } from './contexts/IModelContext';
import { IPackageContext } from './contexts/IPackageContext';
import { IRelationContext } from './contexts/IRelationContext';
import { IBelongsTo, IBelongsToInit } from './interfaces/IBelongsTo';
import { IBelongsToMany, IBelongsToManyInit } from './interfaces/IBelongsToMany';
import { IEntity, IEntityInit } from './interfaces/IEntity';
import { IEnum, IEnumInit } from './interfaces/IEnum';
import { IField } from './interfaces/IField';
import { IHasMany, IHasManyInit } from './interfaces/IHasMany';
import { IHasOne, IHasOneInit } from './interfaces/IHasOne';
import { IModel, IModelInit } from './interfaces/IModel';
import { IModelType } from './interfaces/IModelType';
import { IMutation, IMutationInit } from './interfaces/IMutation';
import { IPackage } from './interfaces/IPackage';
import { IPackagedItemInit, IPackagedItem } from './interfaces/IPackagedItem';
import { IRelation, IRelationInit } from './interfaces/IRelation';
import { Enum } from './model/Enum';
import { Entity } from './model/Entity';
import { Mutation } from './model/Mutation';
import { RelationInit } from './interfaces/types';
import { IValidationContext } from './contexts/IValidationContext';
import { ModelFactory } from './model/Factory';

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

export function isIModelContext(ctx: IModelContext & IValidationContext): ctx is IModelContext & IValidationContext {
  return !!(ctx.isValid
    && ctx.model
    && Array.isArray(ctx.errors));
}

export function isIPackageContext(ctx: IModelContext & IValidationContext): ctx is IPackageContext & IValidationContext {
  return !!(ctx.isValid
    && (ctx as IPackageContext & IValidationContext).model
    && (ctx as IPackageContext & IValidationContext).package
    && Array.isArray((ctx as IPackageContext & IValidationContext).errors));
}

export function isIEntityContext(ctx: IModelContext & IValidationContext): ctx is IEntityContext & IValidationContext {
  return !!(ctx.isValid
    && (ctx as IEntityContext & IValidationContext).model
    && (ctx as IEntityContext & IValidationContext).package
    && (ctx as IEntityContext & IValidationContext).entity
    && Array.isArray((ctx as IEntityContext & IValidationContext).errors));
}

export function isIEnumContext(ctx: IModelContext & IValidationContext): ctx is IEnumContext & IValidationContext {
  return !!(ctx.isValid
    && (ctx as IEnumContext & IValidationContext).model
    && (ctx as IEnumContext & IValidationContext).package
    && (ctx as IEnumContext & IValidationContext).enum
    && Array.isArray((ctx as IEnumContext & IValidationContext).errors));
}

export function isIFieldContext(ctx: IModelContext & IValidationContext): ctx is IFieldContext & IValidationContext {
  return !!(ctx.isValid
    && (ctx as IFieldContext & IValidationContext).model
    && (ctx as IFieldContext & IValidationContext).package
    && (ctx as IFieldContext & IValidationContext).entity
    && (ctx as IFieldContext & IValidationContext).field
    && Array.isArray((ctx as IFieldContext & IValidationContext).errors));
}

export function isIRelationContext(ctx: IModelContext & IValidationContext): ctx is IRelationContext & IValidationContext {
  return !!(ctx.isValid
    && (ctx as IRelationContext & IValidationContext).model
    && (ctx as IRelationContext & IValidationContext).package
    && (ctx as IRelationContext & IValidationContext).entity
    && (ctx as IRelationContext & IValidationContext).field
    && (ctx as IRelationContext & IValidationContext).relation
    && Array.isArray((ctx as IRelationContext & IValidationContext).errors));
}

export function isEnumInit(item: IPackagedItemInit): item is IEnumInit {
  return !!(<IEnumInit>item).values;
}

export function isEntityInit(item: IPackagedItemInit): item is IEntityInit {
  return !!(<IModelInit>item).packages;
}

export function isMutationInit(item: IPackagedItemInit): item is IMutationInit {
  return !!(<IMutationInit>item).payload;
}

export function IsBelongsToInit(item: RelationInit): item is IBelongsToInit {
  return !!(<IBelongsToInit>item).belongsTo;
}

export function IsBelongsToManyInit(item: RelationInit): item is IBelongsToManyInit {
  return !!(<IBelongsToManyInit>item).belongsToMany;
}

export function IsHasOneInit(item: RelationInit): item is IHasOneInit {
  return !!(<IHasOneInit>item).hasOne;
}

export function IsHasManyInit(item: RelationInit): item is IHasManyInit {
  return !!(<IHasManyInit>item).hasMany;
}

export function createPackagedItem(item: IPackagedItemInit, pkg: IPackage): IPackagedItem {
  if (item && pkg) {
    const context = ModelFactory.getContext(pkg) as IPackageContext;
    if (isEnumInit(item)) {
      return new Enum(item, context);
    } else if (isEntityInit(item)) {
      return new Entity(item, context);
    } else if (isMutationInit(item)) {
      return new Mutation(item, context);
    }
  }
}
