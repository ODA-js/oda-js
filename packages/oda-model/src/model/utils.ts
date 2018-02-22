import { Map, Set } from 'immutable';

import { IFieldContext } from '../contexts/IFieldContext';
import { IMutationContext } from '../contexts/IMutationContext';
import { IRelationContext } from '../contexts/IRelationContext';
import { IEntity } from '../interfaces/IEntity';
import { IEntityRef } from '../interfaces/IEntityRef';
import { IField, IFieldInit } from '../interfaces/IField';
import { FieldArgsInput, IFieldArg, IFieldArgInit } from '../interfaces/IFieldArg';
import { IMutation } from '../interfaces/IMutation';
import { IRelation } from '../interfaces/IRelation';
import { EntityRef } from './EntityRef';
import { ModelFactory } from './Factory';
import { Field } from './Field';
import { FieldArg } from './FieldArg';
import { FieldArgsTransform, EntityRefTransform, FieldTransformType } from '../interfaces/types';

export type ArrayToSet<S> = {
  transform: (input: S[]) => Set<S>;
  reverse: (input: Set<S>) => S[];
};

export function TransformRef(): EntityRefTransform {
  return {
    transform: (inp: string | IEntityRef, relation: IRelation) => {
      if (inp) {
        return new EntityRef(inp, ModelFactory.getContext(relation) as IRelationContext);
      } else {
        return null;
      }
    },
    reverse: (inp: IEntityRef) => {
      if (inp) {
        return inp.toString();
      } else {
        return null;
      }
    },
  };
}

export function TransformField(): FieldTransformType {
  return {
    transform: (input: {
      [name: string]: Partial<IFieldInit>,
    } | IFieldInit[], owner: IEntity | IRelation) => {
      const context = ModelFactory.getContext(owner) as IRelationContext;
      if (!Array.isArray(input)) {
        input = Object.keys(input).map(k => ({
          name: k,
          ...input[k],
        }));
      }
      return Map<string, IField>(input.map(p => [p.name, new Field(p, context)]) as [string, IField][]);
    },
    reverse: (input: Map<string, IField>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS() as IFieldInit);
      } else {
        return null;
      }
    },
  };
}

export function TransformArgs(): FieldArgsTransform {
  return {
    transform: (input: FieldArgsInput, owner: IMutation | IField ) => {
      if (input) {
        const context = ModelFactory.getContext(owner) as IMutationContext | IFieldContext;
        if (!Array.isArray(input)) {
          input = Object.keys(input).map(k => ({
            name: k,
            ...input[k],
          }));
        }
        return Map<string, IFieldArg>(input.map(p => [p.name, new FieldArg(p, context)]) as [string, IFieldArg][]);
      } else {
        return null;
      }
    },
    reverse: (input: Map<string, IFieldArg>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(p => p.toJS() as IFieldArgInit) ;
      } else {
        return null;
      }
    },
  };
}
