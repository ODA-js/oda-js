import { Map, Set } from 'immutable';

import { IField, IFieldInit } from '../interfaces/IField';

import { EntityRef } from './EntityRef';
import { Field } from './Field';
import { FieldArg } from './FieldArg';
import { IFieldArgInit, IFieldArg, FieldArgsInput } from '../interfaces/IFieldArg';

export type MapType<T, S> = {
  transform: (input: T) => S;
  reverse: (input: S) => T;
};

export type ArrayToMap<S extends object> = {
  transform: (input: S[]) => Map<string, S>;
  reverse: (input: Map<string, S>) => S[];
};

export type ArrayToSet<S> = {
  transform: (input: S[]) => Set<S>;
  reverse: (input: Set<S>) => S[];
};

export function TransformRef() {
  return {
    transform: (inp) => {
      if (inp) {
        return new EntityRef(inp);
      } else {
        return null;
      }
    },
    reverse: (inp) => {
      if (inp) {
        return inp.toString();
      } else {
        return null;
      }
    },
  };
}

export function TransformField() {
  return {
    transform: (input: {
      [name: string]: Partial<IFieldInit>,
    } | IFieldInit[]) => {
      if (!Array.isArray(input)) {
        input = Object.keys(input).map(k => ({
          name: k,
          ...input[k],
        }));
      }
      return Map<string, IField>(input.map(p => [p.name, new Field(p)]) as [string, IField][]);
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

export function TransformArgs() {
  return {
    transform: (input: FieldArgsInput) => {
      if (input) {
        if (!Array.isArray(input)) {
          input = Object.keys(input).map(k => ({
            name: k,
            ...input[k],
          }));
        }
        return Map<string, IFieldArg>(input.map(p => [p.name, new FieldArg(p)]) as [string, IFieldArg][]);
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
