import { IEntityContext } from '../contexts/IEntityContext';
import { IFieldContext } from '../contexts/IFieldContext';
import { IModelContext } from '../contexts/IModelContext';
import { IPackageContext } from '../contexts/IPackageContext';
import { IRelationContext } from '../contexts/IRelationContext';
import { IBelongsToInit } from './IBelongsTo';
import { IBelongsToManyInit } from './IBelongsToMany';
import { IHasManyInit } from './IHasMany';
import { IHasOneInit } from './IHasOne';
import { IFieldInit, IField } from './IField';
import { IFieldArgInit, IFieldArg } from './IFieldArg';
import { Map } from 'immutable';

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
  transform: (input: {
    [name: string]: Partial<IFieldInit>,
  } | IFieldInit[]) => Map<string, IField>;
  reverse: (input:  Map<string, IField>) => IFieldInit[];
};

export type FieldArgsTransformType = {
  transform: (input: {
    [name: string]: Partial<IFieldArgInit>,
  } | IFieldArgInit[]) => Map<string, IFieldArg>;
  reverse: (input:  Map<string, IFieldArg>) => IFieldArgInit[];
};
