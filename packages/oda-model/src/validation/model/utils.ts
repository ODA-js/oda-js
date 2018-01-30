import { Map, Set } from 'immutable';

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

export function transformMap<S extends { name: string }>(): ArrayToMap<S> {
  return {
    transform: (input: S[]) => Map<string, S>(input.map(p => [p.name, p]) as [string, S][]),
    reverse: (input: Map<string, S>) => Array.from(input.values()[Symbol.iterator]()),
  };
}


export function transformSet<S>(): ArrayToSet<S> {
  return {
    transform: (input: S[]) => Set<S>(input),
    reverse: (input: Set<S>) => Array.from(input.values()[Symbol.iterator]()),
  };
}
