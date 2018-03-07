import { Map } from 'immutable';

import { IEntityContext } from '../contexts/IEntityContext';
import { IFieldContext } from '../contexts/IFieldContext';
import { IModelContext } from '../contexts/IModelContext';
import { IPackageContext } from '../contexts/IPackageContext';
import { IRelationContext } from '../contexts/IRelationContext';
import { IBelongsToInit } from './IBelongsTo';
import { IBelongsToManyInit } from './IBelongsToMany';
import { IField, IFieldInit } from './IField';
import { FieldArgsInput, IFieldArg, IFieldArgInit } from './IFieldArg';
import { IHasManyInit } from './IHasMany';
import { IHasOneInit } from './IHasOne';
import { IEntity } from './IEntity';
import { IRelation } from './IRelation';
import { IMutation } from './IMutation';
import { IEntityRef } from './IEntityRef';

export type RelationType = 'HasMany' | 'HasOne' | 'BelongsToMany' | 'BelongsTo';

export type MetaModelType =
  |'model'
  | 'package'
  | 'mutation'
  | 'entity'
  | 'enum'
  | 'enumItem'
  | 'field'
  | 'fieldArg'
  | 'ref'
  | 'relation'
  ;

export type ValdatedTypes = MetaModelType | RelationType;

export type ValidationContext =
  IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;

export type RestartType = 'model' | 'package' | 'entity' | 'field' | 'relation' | 'mutation' | 'enum';

export type RelationInit = IHasManyInit | IHasOneInit | IBelongsToInit | IBelongsToManyInit;

export type FieldTransformType = {
  transform: (input?: {
    [name: string]: Partial<IFieldInit>,
  } | IFieldInit[], owner?: IEntity | IRelation ) => Map<string, IField>;
  reverse: (input?:  Map<string, IField>) => IFieldInit[];
};
export type FieldArgsTransform = {
  transform: (input?: FieldArgsInput, owner?: IMutation | IField ) => Map<string, IFieldArg>;
  reverse: (input?: Map<string, IFieldArg>) => IFieldArgInit[];
};

export type EntityRefTransform = {
  transform: (inp?: string | IEntityRef, relation?: IRelation) => IEntityRef;
  reverse: (inp?: IEntityRef) => string;
};
