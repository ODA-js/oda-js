import { Map, Set } from 'immutable';


export function transformMap<S extends { name: string }>(): {
  transform: (input: S[]) => Map<string, S>;
  reverse: (input: Map<string, S>) => S[];
} {
  return {
    transform: (input: S[]) => Map<string, S>(input.map(p => [p.name, p]) as [string, S][]),
    reverse: (input: Map<string, S>) => Array.from(input.values()[Symbol.iterator]()),
  };
}

export function transformSet<S>(): {
  transform: (input: S[]) => Set<S>;
  reverse: (input: Set<S>) => S[];
} {
  return {
    transform: (input: S[]) => Set<S>(input),
    reverse: (input: Set<S>) => Array.from(input.values()[Symbol.iterator]()),
  };
}
